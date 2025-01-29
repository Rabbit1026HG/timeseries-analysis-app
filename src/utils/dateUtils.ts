export const formatDate = (date: Date, view: 'daily' | 'monthly' | 'yearly' | 'full' = 'daily'): string => {
  if (view === 'full') {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  const options: Intl.DateTimeFormatOptions = {
    day: view === 'daily' ? 'numeric' : undefined,
    month: view === 'yearly' ? undefined : 'short',
    year: view === 'daily' ? undefined : 'numeric'
  };
  
  return date.toLocaleDateString('default', options);
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const getLastDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getLastDayOfYear = (date: Date): Date => {
  return new Date(date.getFullYear(), 11, 31);
};