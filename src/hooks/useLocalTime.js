import { useEffect, useState } from 'react';

const TIME_ZONE = 'Asia/Kathmandu';

export function formatKathmanduTime(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return '--:--';
  }
}

/** Local time in Kathmandu, refreshed every 30 seconds. */
export function useLocalTime() {
  const [time, setTime] = useState(() => formatKathmanduTime());

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatKathmanduTime()), 30000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}
