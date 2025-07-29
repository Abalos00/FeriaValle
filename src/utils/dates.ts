import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: es });
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
};

export const formatMonth = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: es });
};

export const getDayRange = (date: Date) => ({
  start: startOfDay(date),
  end: endOfDay(date),
});

export const getMonthRange = (date: Date) => ({
  start: startOfMonth(date),
  end: endOfMonth(date),
});

export const isToday = (date: Date): boolean => {
  return startOfDay(date).getTime() === startOfDay(new Date()).getTime();
};