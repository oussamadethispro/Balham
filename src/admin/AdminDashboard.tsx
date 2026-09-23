import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building,
  Wrench,
  Star,
  Inbox,
  Clock,
  MapPin,
  MessageSquare,
  Search,
  Globe,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Shield,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import { BusinessSettings, ServiceItem, OpeningHoursData, TestimonialItem, SeoSettings } from '../types.js';
import { isStaticHost, handleStaticApiRequest } from './adminStorage.js';

interface AdminDashboardProps {
  onClose: () => void;
  onDataRefresh: () => void;
}

type AdminTab =
  | 'overview'
  | 'business'
  | 'services'
  | 'reviews'
  | 'enquiries'
  | 'hours'
  | 'google'
  | 'whatsapp'
  | 'seo'
  | 'guide'
  | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onDataRefresh }) => {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('balham_admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tab data states
  const [businessData, setBusinessData] = useState<BusinessSettings | null>(null);
  const [servicesData, setServicesData] = useState<ServiceItem[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>([]);
  const [enquiriesData, setEnquiriesData] = useState<any[]>([]);
  const [openingHoursData, setOpeningHoursData] = useState<OpeningHoursData | null>(null);
  const [googleData, setGoogleData] = useState<any>(null);
  const [seoData, setSeoData] = useState<SeoSettings | null>(null);

  // Modals & sub-state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Auto clear toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
  };

  // Check auth session
  useEffect(() => {
    if (token) {
      loadTabData(activeTab);
    }
  }, [token, activeTab]);

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    // If running on static host (GitHub Pages) or holding a static token, route to local handler
    if (isStaticHost() || (token && token.startsWith('balham_static_'))) {
      const res = await handleStaticApiRequest(url, options);
      if (res.status === 401) {
        localStorage.removeItem('balham_admin_token');
        setToken(null);
        throw new Error('Session expired. Please log in again.');
      }
      return res;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    try {
      const res = await fetch(url, { ...options, headers });
      const contentType = res.headers.get('content-type') || '';

      // If server returned HTML (like a 404.html page on static host) instead of JSON
      if (!contentType.includes('application/json')) {
        return await handleStaticApiRequest(url, options);
      }

      if (res.status === 401) {
        localStorage.removeItem('balham_admin_token');
        setToken(null);
        throw new Error('Session expired. Please log in again.');
      }
      return res;
    } catch (e) {
      // Network failure: fall back to local storage handler
      return await handleStaticApiRequest(url, options);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      let data: any = null;
      let isOk = false;

      // Check if we are on a static environment or if /api/auth/login returns non-JSON HTML
      if (isStaticHost()) {
        const mockRes = await handleStaticApiRequest('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        });
        data = await mockRes.json();
        isOk = mockRes.ok;
      } else {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await res.json();
            isOk = res.ok;
          } else {
            // Received HTML or 404 from static host / misconfigured proxy -> fall back to local auth
            const mockRes = await handleStaticApiRequest('/api/auth/login', {
              method: 'POST',
              body: JSON.stringify({ username, password }),
            });
            data = await mockRes.json();
            isOk = mockRes.ok;
          }
        } catch (netErr) {
          // Network failure: fallback to local auth
          const mockRes = await handleStaticApiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
          });
          data = await mockRes.json();
          isOk = mockRes.ok;
        }
      }

      if (!isOk) {
        throw new Error(data?.error || 'Invalid credentials. Default: admin / AdminPassword2026!');
      }

      localStorage.setItem('balham_admin_token', data.token);
      setToken(data.token);
      setUsername('');
      setPassword('');
      showToast('Logged in successfully to Balham Key Cutting Admin');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('balham_admin_token');
    setToken(null);
    showToast('Logged out');
  };

  const loadTabData = async (tab: AdminTab) => {
    if (!token) return;
    setLoading(true);
    try {
      if (tab === 'overview') {
        const res = await apiFetch('/api/admin/overview');
        const data = await res.json();
        setOverviewStats(data);
      } else if (tab === 'business') {
        const res = await apiFetch('/api/admin/business');
        const data = await res.json();
        setBusinessData(data);
      } else if (tab === 'services') {
        const res = await apiFetch('/api/admin/services');
        const data = await res.json();
        setServicesData(data);
      } else if (tab === 'reviews') {
        const res = await apiFetch('/api/admin/testimonials');
        const data = await res.json();
        setTestimonialsData(data);
        const gRes = await apiFetch('/api/admin/google-settings');
        const gData = await gRes.json();
        setGoogleData(gData);
      } else if (tab === 'enquiries') {
        const query = new URLSearchParams({
          status: enquiryFilter,
          search: enquirySearch,
        }).toString();
        const res = await apiFetch(`/api/admin/enquiries?${query}`);
        const data = await res.json();
        setEnquiriesData(data);
      } else if (tab === 'hours') {
        const res = await apiFetch('/api/admin/opening-hours');
        const data = await res.json();
        setOpeningHoursData(data);
      } else if (tab === 'google') {
        const res = await apiFetch('/api/admin/google-settings');
        const data = await res.json();
        setGoogleData(data);
      } else if (tab === 'whatsapp') {
        const res = await apiFetch('/api/admin/business');
        const data = await res.json();
        setBusinessData(data);
      } else if (tab === 'seo') {
        const res = await apiFetch('/api/admin/seo-settings');
        const data = await res.json();
        setSeoData(data);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save Business Info
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessData) return;
    try {
      const res = await apiFetch('/api/admin/business', {
        method: 'PUT',
        body: JSON.stringify(businessData),
      });
      if (!res.ok) throw new Error('Failed to update business settings');
      showToast('Business information saved successfully');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Save Services CRUD
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      if (isNewService) {
        const res = await apiFetch('/api/admin/services', {
          method: 'POST',
          body: JSON.stringify(editingService),
        });
        if (!res.ok) throw new Error('Failed to create service');
        showToast('Service added');
      } else {
        const res = await apiFetch(`/api/admin/services/${editingService.id}`, {
          method: 'PUT',
          body: JSON.stringify(editingService),
        });
        if (!res.ok) throw new Error('Failed to update service');
        showToast('Service updated');
      }
      setEditingService(null);
      loadTabData('services');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await apiFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showToast('Service deleted');
      loadTabData('services');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Reorder services
  const handleMoveService = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...servicesData];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    setServicesData(newItems);
    try {
      await apiFetch('/api/admin/services/reorder', {
        method: 'POST',
        body: JSON.stringify({ orderedIds: newItems.map((s) => s.id) }),
      });
      showToast('Service order saved');
      onDataRefresh();
    } catch (e: any) {
      showToast('Failed to save order', 'error');
    }
  };

  // Enquiries status update
  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    try {
      const res = await apiFetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      showToast(`Status updated to ${status}`);
      loadTabData('enquiries');
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry((prev: any) => ({ ...prev, status }));
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await apiFetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete enquiry');
      showToast('Enquiry deleted');
      setSelectedEnquiry(null);
      loadTabData('enquiries');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Save Testimonial
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    try {
      if (isNewTestimonial) {
        const res = await apiFetch('/api/admin/testimonials', {
          method: 'POST',
          body: JSON.stringify(editingTestimonial),
        });
        if (!res.ok) throw new Error('Failed to create testimonial');
        showToast('Testimonial created');
      } else {
        const res = await apiFetch(`/api/admin/testimonials/${editingTestimonial.id}`, {
          method: 'PUT',
          body: JSON.stringify(editingTestimonial),
        });
        if (!res.ok) throw new Error('Failed to update testimonial');
        showToast('Testimonial updated');
      }
      setEditingTestimonial(null);
      loadTabData('reviews');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await apiFetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      showToast('Testimonial deleted');
      loadTabData('reviews');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Save Opening Hours
  const handleSaveOpeningHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openingHoursData) return;
    try {
      const res = await apiFetch('/api/admin/opening-hours', {
        method: 'PUT',
        body: JSON.stringify(openingHoursData),
      });
      if (!res.ok) throw new Error('Failed to update opening hours');
      showToast('Opening hours updated');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Save Google Integration Settings & Test Sync
  const handleSaveGoogleSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleData) return;
    try {
      const res = await apiFetch('/api/admin/google-settings', {
        method: 'PUT',
        body: JSON.stringify(googleData),
      });
      if (!res.ok) throw new Error('Failed to update Google settings');
      showToast('Google integration settings saved');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleTestGoogleSync = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/admin/google-settings/sync', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: googleData.apiKey,
          placeId: googleData.placeId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sync with Google Places API');
      showToast(data.message || 'Successfully synced Google reviews!');
      loadTabData('google');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save SEO settings
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoData) return;
    try {
      const res = await apiFetch('/api/admin/seo-settings', {
        method: 'PUT',
        body: JSON.stringify(seoData),
      });
      if (!res.ok) throw new Error('Failed to update SEO settings');
      showToast('SEO settings saved');
      onDataRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'error');
      return;
    }

    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      showToast('Admin password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-200 relative space-y-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-[#F5B942] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Portal</h2>
            <p className="text-xs text-slate-500">
              Balham Key Cutting Management System
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#F5B942] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#F5B942] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-lg bg-slate-900 hover:bg-[#111827] text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md active:scale-98 disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-center">
              Default demo credentials: <span className="font-mono font-bold text-slate-700">admin</span> / <span className="font-mono font-bold text-slate-700">AdminPassword2026!</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD SHELL
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex bg-slate-900/40 backdrop-blur-sm overflow-hidden">
      <div className="bg-slate-100 flex flex-col md:flex-row w-full h-full">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold text-white animate-fade-in ${
              toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#111827] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
          <div>
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F5B942] text-[#111827] flex items-center justify-center font-bold">
                  B
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-tight">Balham Key Cutting</h1>
                  <p className="text-[10px] text-slate-400">Administration Console</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
                { id: 'business', label: 'Business Information', icon: Building },
                { id: 'services', label: 'Services Manager', icon: Wrench },
                { id: 'reviews', label: 'Reviews & Testimonials', icon: Star },
                { id: 'enquiries', label: 'Customer Enquiries', icon: Inbox },
                { id: 'hours', label: 'Opening Hours', icon: Clock },
                { id: 'google', label: 'Google Integration', icon: MapPin },
                { id: 'whatsapp', label: 'WhatsApp Settings', icon: MessageSquare },
                { id: 'seo', label: 'SEO Settings', icon: Search },
                { id: 'guide', label: 'Production & Setup Guide', icon: BookOpen },
                { id: 'security', label: 'Admin Security', icon: Lock },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-[#F5B942] text-[#111827] font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User & Actions footer */}
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Logged in</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Return to public site"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          
          {/* Top Bar */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-900 capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
              <p className="text-xs text-slate-500">
                Manage your live website content and settings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => loadTabData(activeTab)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Scrollable Tab Body */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && overviewStats && (
              <div className="space-y-6 max-w-6xl">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Enquiries</p>
                    <p className="text-3xl font-black text-slate-900 mt-2 tabular-nums">{overviewStats.totalEnquiries}</p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">{overviewStats.newEnquiries} new unhandled</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Services</p>
                    <p className="text-3xl font-black text-slate-900 mt-2 tabular-nums">{overviewStats.activeServices}</p>
                    <p className="text-xs text-slate-500 mt-1">out of {overviewStats.totalServices} total</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Google Reviews</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-3xl font-black text-slate-900 tabular-nums">
                        {overviewStats.googleRating !== 'Not Connected' ? `${overviewStats.googleRating}★` : 'Not Set'}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {overviewStats.isGoogleConnected ? `${overviewStats.googleReviewsCount} synced reviews` : 'API setup pending'}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Website Status</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-lg font-bold text-slate-900">Live & Operational</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Balham, London SW12</p>
                  </div>
                </div>

                {/* Recent enquiries */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Recent Customer Enquiries</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs font-bold text-[#111827] hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  {overviewStats.recentEnquiries && overviewStats.recentEnquiries.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {overviewStats.recentEnquiries.map((enq: any) => (
                        <div key={enq.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{enq.name}</span>
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  enq.status === 'new'
                                    ? 'bg-amber-100 text-amber-800'
                                    : enq.status === 'contacted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {enq.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 truncate max-w-lg mt-0.5">{enq.message}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {enq.service} · {enq.phone || enq.email} · {new Date(enq.createdAt).toLocaleDateString('en-GB')}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setActiveTab('enquiries');
                            }}
                            className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
                          >
                            Open
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">No enquiries yet.</p>
                  )}
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('business')}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors"
                  >
                    <Building className="w-5 h-5 text-[#F5B942] mb-2" />
                    <h4 className="text-sm font-bold text-slate-900">Update Address & Hours</h4>
                    <p className="text-xs text-slate-500 mt-1">Change Balham shop details or contact numbers</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors"
                  >
                    <Wrench className="w-5 h-5 text-[#F5B942] mb-2" />
                    <h4 className="text-sm font-bold text-slate-900">Manage Key Services</h4>
                    <p className="text-xs text-slate-500 mt-1">Add or edit key cutting offerings</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('google')}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-[#F5B942] mb-2" />
                    <h4 className="text-sm font-bold text-slate-900">Connect Google Reviews</h4>
                    <p className="text-xs text-slate-500 mt-1">Enter your Google Place ID & API key</p>
                  </button>
                </div>
              </div>
            )}

            {/* 2. BUSINESS INFORMATION TAB */}
            {activeTab === 'business' && businessData && (
              <form onSubmit={handleSaveBusiness} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-4xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Business Information Settings</h3>
                  <p className="text-xs text-slate-500">Edit core company details shown throughout the site</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessData.businessName}
                      onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Tagline / Headline
                    </label>
                    <input
                      type="text"
                      value={businessData.tagline}
                      onChange={(e) => setBusinessData({ ...businessData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Shop Telephone Number
                    </label>
                    <input
                      type="text"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp Number (International format, digits only)
                    </label>
                    <input
                      type="text"
                      value={businessData.whatsapp}
                      onChange={(e) => setBusinessData({ ...businessData, whatsapp: e.target.value })}
                      placeholder="447700900077"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={businessData.email}
                      onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={businessData.websiteUrl}
                      onChange={(e) => setBusinessData({ ...businessData, websiteUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Location & Address (Balham, London)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={businessData.address}
                        onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Area / Suburb
                      </label>
                      <input
                        type="text"
                        value={businessData.area}
                        onChange={(e) => setBusinessData({ ...businessData, area: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={businessData.postcode}
                        onChange={(e) => setBusinessData({ ...businessData, postcode: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={businessData.latitude}
                        onChange={(e) => setBusinessData({ ...businessData, latitude: parseFloat(e.target.value) || 51.4442 })}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={businessData.longitude}
                        onChange={(e) => setBusinessData({ ...businessData, longitude: parseFloat(e.target.value) || -0.1528 })}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Directions Help Line
                      </label>
                      <input
                        type="text"
                        value={businessData.directionsHelp}
                        onChange={(e) => setBusinessData({ ...businessData, directionsHelp: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Business Story & Description
                  </label>
                  <textarea
                    rows={4}
                    value={businessData.businessDescription}
                    onChange={(e) => setBusinessData({ ...businessData, businessDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800"
                  >
                    Save Business Changes
                  </button>
                </div>
              </form>
            )}

            {/* 3. SERVICES MANAGER TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Key Cutting Services</h3>
                    <p className="text-xs text-slate-500">Configure services displayed on the homepage</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewService(true);
                      setEditingService({
                        id: '',
                        name: '',
                        shortDescription: '',
                        fullDescription: '',
                        icon: 'KeyRound',
                        turnaround: '2 - 3 minutes',
                        active: true,
                        sortOrder: servicesData.length + 1,
                        features: ['High precision duplication', 'Deburred and polished'],
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Service</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200 overflow-hidden shadow-sm">
                  {servicesData.map((svc, index) => (
                    <div key={svc.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveService(index, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === servicesData.length - 1}
                            onClick={() => handleMoveService(index, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{svc.name}</h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                svc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {svc.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{svc.shortDescription}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Turnaround: {svc.turnaround} · Icon: {svc.icon}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewService(false);
                            setEditingService({ ...svc });
                          }}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(svc.id)}
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Edit Modal */}
                {editingService && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">
                          {isNewService ? 'Add Service' : 'Edit Service'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveService} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name *</label>
                          <input
                            type="text"
                            required
                            value={editingService.name}
                            onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description *</label>
                          <textarea
                            rows={2}
                            required
                            value={editingService.shortDescription}
                            onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Turnaround Time</label>
                            <input
                              type="text"
                              value={editingService.turnaround}
                              onChange={(e) => setEditingService({ ...editingService, turnaround: e.target.value })}
                              placeholder="2 - 3 minutes"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Icon</label>
                            <select
                              value={editingService.icon}
                              onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            >
                              <option value="KeyRound">KeyRound (Standard Key)</option>
                              <option value="Home">Home (House Keys)</option>
                              <option value="CopyCheck">CopyCheck (Spares)</option>
                              <option value="Building2">Building2 (Commercial)</option>
                              <option value="Wrench">Wrench (Replacement)</option>
                              <option value="ShieldCheck">ShieldCheck (Mortice/Chubb)</option>
                              <option value="Lock">Lock (Padlocks)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Key Bullet Points (one per line)
                          </label>
                          <textarea
                            rows={3}
                            value={(editingService.features || []).join('\n')}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                features: e.target.value.split('\n').filter((l) => l.trim()),
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="svcActive"
                            checked={editingService.active}
                            onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                            className="w-4 h-4 rounded text-[#F5B942]"
                          />
                          <label htmlFor="svcActive" className="text-xs font-semibold text-slate-700">
                            Service is active and visible on website
                          </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingService(null)}
                            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider"
                          >
                            Save Service
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. REVIEWS & TESTIMONIALS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 max-w-5xl">
                {/* Google Reviews info banner */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Google Places API Reviews Integration</h3>
                        <p className="text-xs text-slate-500">
                          {googleData?.hasApiKey
                            ? `Connected · Place ID: ${googleData?.placeId || 'configured'}`
                            : 'Not configured yet. Connect your Google Places API to stream live Google reviews.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('google')}
                      className="text-xs font-bold text-[#111827] hover:underline"
                    >
                      Configure Google Keys →
                    </button>
                  </div>
                </div>

                {/* Manual Local Testimonials Management */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Local Customer Testimonials</h3>
                      <p className="text-xs text-slate-500">
                        Distinctly labeled customer feedback from counter visits (never spoofed as Google reviews)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsNewTestimonial(true);
                        setEditingTestimonial({
                          id: '',
                          authorName: '',
                          location: 'Balham Resident',
                          rating: 5,
                          reviewText: '',
                          serviceUsed: 'Key Duplication',
                          date: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
                          active: true,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200 overflow-hidden shadow-sm">
                    {testimonialsData.map((test) => (
                      <div key={test.id} className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{test.authorName}</span>
                            <span className="text-xs text-slate-400">({test.location})</span>
                            <span className="text-xs text-[#F5B942] font-bold">{'★'.repeat(test.rating)}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                test.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {test.active ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 italic">"{test.reviewText}"</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Service: {test.serviceUsed} · Date: {test.date}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setIsNewTestimonial(false);
                              setEditingTestimonial({ ...test });
                            }}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTestimonial(test.id)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial Modal */}
                {editingTestimonial && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">
                          {isNewTestimonial ? 'Add Testimonial' : 'Edit Testimonial'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial(null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveTestimonial} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
                          <input
                            type="text"
                            required
                            value={editingTestimonial.authorName}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, authorName: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Area</label>
                            <input
                              type="text"
                              value={editingTestimonial.location}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                              placeholder="Balham Resident"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (1 - 5)</label>
                            <select
                              value={editingTestimonial.rating}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            >
                              <option value="5">5 Stars ★★★★★</option>
                              <option value="4">4 Stars ★★★★</option>
                              <option value="3">3 Stars ★★★</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Review Text *</label>
                          <textarea
                            rows={3}
                            required
                            value={editingTestimonial.reviewText}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, reviewText: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Service Used</label>
                            <input
                              type="text"
                              value={editingTestimonial.serviceUsed}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, serviceUsed: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Display Date</label>
                            <input
                              type="text"
                              value={editingTestimonial.date}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, date: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="testActive"
                            checked={editingTestimonial.active}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, active: e.target.checked })}
                            className="w-4 h-4 rounded text-[#F5B942]"
                          />
                          <label htmlFor="testActive" className="text-xs font-semibold text-slate-700">
                            Visible on website
                          </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingTestimonial(null)}
                            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider"
                          >
                            Save Testimonial
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Customer Key Enquiries</h3>
                    <p className="text-xs text-slate-500">View and respond to leads sent from the contact form</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Status filter */}
                    <select
                      value={enquiryFilter}
                      onChange={(e) => {
                        setEnquiryFilter(e.target.value);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New Only</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>

                    {/* Search input */}
                    <div className="relative flex-1 sm:w-60">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search name, phone, message..."
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Enquiries list */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  {enquiriesData && enquiriesData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">Service</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {enquiriesData.map((enq) => (
                            <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-bold text-slate-900">{enq.name}</div>
                                <div className="text-[11px] text-slate-500 truncate max-w-xs">{enq.message}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-slate-800 font-medium">{enq.phone || '—'}</div>
                                <div className="text-[11px] text-slate-400">{enq.email || '—'}</div>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-700">
                                {enq.service}
                              </td>
                              <td className="px-4 py-3 text-slate-500 tabular-nums">
                                {new Date(enq.createdAt).toLocaleDateString('en-GB')}
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={enq.status}
                                  onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                                  className={`text-[11px] font-bold px-2 py-1 rounded border-0 ${
                                    enq.status === 'new'
                                      ? 'bg-amber-100 text-amber-800'
                                      : enq.status === 'contacted'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-right space-x-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedEnquiry(enq)}
                                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEnquiry(enq.id)}
                                  className="p-1 rounded text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No enquiries match your search or filter criteria.
                    </div>
                  )}
                </div>

                {/* Enquiry Details Drawer/Modal */}
                {selectedEnquiry && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              selectedEnquiry.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : selectedEnquiry.status === 'contacted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {selectedEnquiry.status}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedEnquiry.name}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <a href={`tel:${selectedEnquiry.phone}`} className="font-bold text-slate-900 hover:underline">
                            {selectedEnquiry.phone || 'No phone supplied'}
                          </a>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <a href={`mailto:${selectedEnquiry.email}`} className="font-bold text-slate-900 hover:underline">
                            {selectedEnquiry.email || 'No email supplied'}
                          </a>
                        </div>

                        <div className="flex items-center gap-3">
                          <Wrench className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-800">Requested Service: {selectedEnquiry.service}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="font-bold text-slate-900 mb-1">Customer Message:</p>
                          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {selectedEnquiry.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {selectedEnquiry.phone && (
                            <a
                              href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${selectedEnquiry.name}, thank you for contacting Balham Key Cutting regarding ${selectedEnquiry.service}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>
                          )}
                          {selectedEnquiry.phone && (
                            <a
                              href={`tel:${selectedEnquiry.phone}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Call
                            </a>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(null)}
                          className="px-4 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. OPENING HOURS TAB */}
            {activeTab === 'hours' && openingHoursData && (
              <form onSubmit={handleSaveOpeningHours} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-3xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Opening Hours Management</h3>
                  <p className="text-xs text-slate-500">Configure daily opening times and bank holiday alerts</p>
                </div>

                <div className="space-y-3">
                  {openingHoursData.schedule.map((item, idx) => (
                    <div key={item.day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-sm font-bold text-slate-900 w-28">{item.day}</span>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-500">Open:</label>
                          <input
                            type="time"
                            disabled={item.isClosed}
                            value={item.openTime}
                            onChange={(e) => {
                              const updated = [...openingHoursData.schedule];
                              updated[idx].openTime = e.target.value;
                              setOpeningHoursData({ ...openingHoursData, schedule: updated });
                            }}
                            className="px-2.5 py-1 rounded border border-slate-300 text-xs bg-white disabled:opacity-30"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-500">Close:</label>
                          <input
                            type="time"
                            disabled={item.isClosed}
                            value={item.closeTime}
                            onChange={(e) => {
                              const updated = [...openingHoursData.schedule];
                              updated[idx].closeTime = e.target.value;
                              setOpeningHoursData({ ...openingHoursData, schedule: updated });
                            }}
                            className="px-2.5 py-1 rounded border border-slate-300 text-xs bg-white disabled:opacity-30"
                          />
                        </div>

                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer ml-2">
                          <input
                            type="checkbox"
                            checked={item.isClosed}
                            onChange={(e) => {
                              const updated = [...openingHoursData.schedule];
                              updated[idx].isClosed = e.target.checked;
                              setOpeningHoursData({ ...openingHoursData, schedule: updated });
                            }}
                            className="w-4 h-4 rounded text-[#F5B942]"
                          />
                          <span>Closed</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Special Holiday / Bank Holiday Notice
                  </label>
                  <textarea
                    rows={2}
                    value={openingHoursData.holidayNotice}
                    onChange={(e) => setOpeningHoursData({ ...openingHoursData, holidayNotice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800"
                  >
                    Save Opening Hours
                  </button>
                </div>
              </form>
            )}

            {/* 7. GOOGLE INTEGRATION TAB */}
            {activeTab === 'google' && googleData && (
              <form onSubmit={handleSaveGoogleSettings} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-3xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Google Places API & Business Profile</h3>
                  <p className="text-xs text-slate-500">
                    Connect your Google Place ID and Google Maps API key to stream live reviews
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Google Place ID
                    </label>
                    <input
                      type="text"
                      value={googleData.placeId || ''}
                      onChange={(e) => setGoogleData({ ...googleData, placeId: e.target.value })}
                      placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono text-xs"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Find your Google Place ID using Google's Place ID Finder tool for your Balham address.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Google Cloud API Key (with Places API enabled)
                    </label>
                    <input
                      type="password"
                      value={googleData.apiKey || ''}
                      onChange={(e) => setGoogleData({ ...googleData, apiKey: e.target.value })}
                      placeholder={googleData.hasApiKey ? `Configured (${googleData.maskedApiKey})` : 'AIzaSy...'}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono text-xs"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Your API key is securely saved on the server and never exposed in client JavaScript.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="googleSync"
                      checked={googleData.syncEnabled || false}
                      onChange={(e) => setGoogleData({ ...googleData, syncEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-[#F5B942]"
                    />
                    <label htmlFor="googleSync" className="text-xs font-semibold text-slate-700">
                      Enable automatic background review synchronization
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleTestGoogleSync}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider"
                  >
                    Test & Fetch Google Reviews Now
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800"
                  >
                    Save Google Settings
                  </button>
                </div>
              </form>
            )}

            {/* 8. WHATSAPP SETTINGS TAB */}
            {activeTab === 'whatsapp' && businessData && (
              <form onSubmit={handleSaveBusiness} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-2xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">WhatsApp Integration Settings</h3>
                  <p className="text-xs text-slate-500">Configure floating button and header direct chat link</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp Phone Number (with Country Code, digits only)
                    </label>
                    <input
                      type="text"
                      value={businessData.whatsapp}
                      onChange={(e) => setBusinessData({ ...businessData, whatsapp: e.target.value })}
                      placeholder="447700900077"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono text-xs"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      For UK numbers: format as 44 + phone number without leading zero (e.g. 447700900077).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <p className="font-semibold text-slate-900 mb-1">Pre-filled Customer Message:</p>
                    <p className="font-mono bg-white p-2.5 rounded border border-slate-200 text-slate-800">
                      "Hello Balham Key Cutting, I would like to enquire about key cutting."
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800"
                  >
                    Save WhatsApp Number
                  </button>
                </div>
              </form>
            )}

            {/* 9. SEO SETTINGS TAB */}
            {activeTab === 'seo' && seoData && (
              <form onSubmit={handleSaveSeo} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-3xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Search Engine Optimization (SEO)</h3>
                  <p className="text-xs text-slate-500">Target local Balham, London keywords and social sharing cards</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Homepage Title Tag
                    </label>
                    <input
                      type="text"
                      value={seoData.homepageTitle}
                      onChange={(e) => setSeoData({ ...seoData, homepageTitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={seoData.metaDescription}
                      onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Keep between 120 and 160 characters for optimal Google search snippet display.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Google Analytics Measurement ID
                      </label>
                      <input
                        type="text"
                        value={seoData.googleAnalyticsId || ''}
                        onChange={(e) => setSeoData({ ...seoData, googleAnalyticsId: e.target.value })}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Google Search Console Verification Tag
                      </label>
                      <input
                        type="text"
                        value={seoData.googleSearchConsoleCode || ''}
                        onChange={(e) => setSeoData({ ...seoData, googleSearchConsoleCode: e.target.value })}
                        placeholder="google-site-verification=..."
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800"
                  >
                    Save SEO Settings
                  </button>
                </div>
              </form>
            )}

            {/* 10. PRODUCTION & SETUP GUIDE TAB */}
            {activeTab === 'guide' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-4xl space-y-8 text-xs text-slate-700 leading-relaxed">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Balham Key Cutting · Production Deployment & Setup Handbook
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete 10-step instructions for running, managing, and launching this application.
                  </p>
                </div>

                <div className="space-y-6 divide-y divide-slate-100">
                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">1. How to Run the Project Locally</h4>
                    <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`# 1. Clone repository
git clone <repo-url> && cd balham-key-cutting

# 2. Install dependencies
npm install

# 3. Start development server (serves Vite + Express on port 3000)
npm run dev`}
                    </pre>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">2. How the Database Works & Persistence</h4>
                    <p>
                      The application includes a clean, zero-configuration JSON file database located at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/data/database.json</code>. Changes made through this Admin Dashboard (services, enquiries, business info, opening hours) are immediately written to disk and cached in memory. If you migrate to PostgreSQL, you can use the same schema.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">3. How to Change Admin Credentials</h4>
                    <p>
                      Go to the <strong>Admin Security</strong> tab on the left sidebar to update your password immediately. Password hashes use Node's native scrypt encryption with secure random salts.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">4. How to Configure Google Maps</h4>
                    <p>
                      In the <strong>Business Information</strong> tab, enter your shop's Balham street address, postcode (e.g. SW12 9BW), and latitude/longitude coordinates (default: 51.4442, -0.1528). The interactive map and direction links will update automatically.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">5. How to Configure Google Reviews</h4>
                    <p>
                      Navigate to the <strong>Google Integration</strong> tab. Paste your Google Cloud API key (with Places API enabled) and your business's Google Place ID. Click "Test & Fetch Google Reviews Now". All API calls run securely through the server proxy so keys are never leaked to public browsers.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">6. How to Configure WhatsApp</h4>
                    <p>
                      Go to the <strong>WhatsApp Settings</strong> tab. Enter your phone number with country code (e.g. <code className="font-mono bg-slate-100 px-1">447700900077</code>). The floating button, sticky mobile action bar, and hero CTAs will route enquiries to that WhatsApp account.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">7. How to Configure the Exact Business Address</h4>
                    <p>
                      In <strong>Business Information</strong>, enter your exact street address, Balham London postcode, and opening hours. No developer edits are required.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">8. How to Deploy to Production</h4>
                    <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`# Build frontend production bundle
npm run build

# Run production server
NODE_ENV=production npm start`}
                    </pre>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">9. How to Connect Your Custom Domain</h4>
                    <p>
                      Add a CNAME record pointing your domain (e.g. <code className="font-mono">balhamkeycutting.co.uk</code>) to your Cloud Run or server host, or configure an A record to your server's static IP.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">10. How to Enable HTTPS</h4>
                    <p>
                      Cloud Run, Vercel, and Render provide automatic free SSL certificates via Let's Encrypt. On an Ubuntu VPS, run <code className="font-mono bg-slate-100 px-1">certbot --nginx -d balhamkeycutting.co.uk</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 11. ADMIN SECURITY TAB */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-md space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Change Admin Password</h3>
                  <p className="text-xs text-slate-500">Update password for admin user</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    New Password (min 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}

          </div>

        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;
