
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: string, currency: string = 'SAR') => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '0 ' + currency;
  
  return numValue.toLocaleString('ar-SA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' ' + currency;
};

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
