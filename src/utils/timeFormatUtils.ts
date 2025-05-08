
// Format elapsed time for display (HH:MM:SS)
export const formatElapsedTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hrs.toString().padStart(2, '0'),
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

// Format time in seconds to minutes for display
export const formatMinutes = (seconds: number): number => {
  return Math.round(seconds / 60);
};

// Format time in seconds to hours for display
export const formatHours = (seconds: number): number => {
  return Math.round((seconds / 3600) * 100) / 100;
};

// Format date to readable string
export const formatDateString = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

// Format time to readable string
export const formatTimeString = (time: string | Date): string => {
  if (!time) return 'N/A';
  
  const timeObj = typeof time === 'string' ? new Date(time) : time;
  return timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
