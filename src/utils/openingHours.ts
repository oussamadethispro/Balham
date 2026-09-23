import { OpeningHourDay } from '../types.js';

export interface ShopStatus {
  isOpen: boolean;
  statusText: string;
  nextEventText: string;
  todaySchedule?: OpeningHourDay;
}

export function getShopStatus(schedule: OpeningHourDay[]): ShopStatus {
  if (!schedule || schedule.length === 0) {
    return {
      isOpen: false,
      statusText: 'Closed',
      nextEventText: 'Check schedule for hours',
    };
  }

  // Get current time in Europe/London
  const now = new Date();
  const londonDateString = now.toLocaleString('en-GB', { timeZone: 'Europe/London' });
  // Format: "DD/MM/YYYY, HH:MM:SS"
  const londonDayIndex = new Date(
    now.toLocaleString('en-US', { timeZone: 'Europe/London' })
  ).getDay(); // 0=Sunday, 1=Monday...

  // Format current hours and minutes into "HH:MM"
  const londonParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const currentHour = parseInt(londonParts.find((p) => p.type === 'hour')?.value || '0', 10);
  const currentMinute = parseInt(londonParts.find((p) => p.type === 'minute')?.value || '0', 10);
  const currentTimeNumber = currentHour * 60 + currentMinute;

  const todayDay = schedule.find((d) => d.dayIndex === londonDayIndex);

  if (!todayDay || todayDay.isClosed) {
    // Find next open day
    const nextOpen = findNextOpenDay(schedule, londonDayIndex);
    return {
      isOpen: false,
      statusText: 'Closed Today',
      nextEventText: nextOpen ? `Opens ${nextOpen.day} at ${nextOpen.openTime}` : 'Closed',
      todaySchedule: todayDay,
    };
  }

  const [openH, openM] = todayDay.openTime.split(':').map(Number);
  const [closeH, closeM] = todayDay.closeTime.split(':').map(Number);
  const openTimeNumber = openH * 60 + openM;
  const closeTimeNumber = closeH * 60 + closeM;

  if (currentTimeNumber >= openTimeNumber && currentTimeNumber < closeTimeNumber) {
    return {
      isOpen: true,
      statusText: 'Open Now',
      nextEventText: `Closes at ${todayDay.closeTime}`,
      todaySchedule: todayDay,
    };
  } else if (currentTimeNumber < openTimeNumber) {
    return {
      isOpen: false,
      statusText: 'Closed Now',
      nextEventText: `Opens today at ${todayDay.openTime}`,
      todaySchedule: todayDay,
    };
  } else {
    // Closed for the day, find tomorrow's hours
    const nextOpen = findNextOpenDay(schedule, londonDayIndex);
    return {
      isOpen: false,
      statusText: 'Closed Now',
      nextEventText: nextOpen ? `Opens ${nextOpen.day === getTomorrowName(londonDayIndex) ? 'tomorrow' : nextOpen.day} at ${nextOpen.openTime}` : 'Closed',
      todaySchedule: todayDay,
    };
  }
}

function findNextOpenDay(schedule: OpeningHourDay[], currentDayIndex: number): OpeningHourDay | null {
  for (let i = 1; i <= 7; i++) {
    const nextIndex = (currentDayIndex + i) % 7;
    const day = schedule.find((d) => d.dayIndex === nextIndex);
    if (day && !day.isClosed) {
      return day;
    }
  }
  return null;
}

function getTomorrowName(currentDayIndex: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[(currentDayIndex + 1) % 7];
}
