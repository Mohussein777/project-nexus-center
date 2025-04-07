
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: string | number, currency: string = 'SAR') => {
  // Convert to string first if it's a number
  const stringValue = typeof value === 'number' ? value.toString() : value;
  const numValue = parseFloat(stringValue);
  if (isNaN(numValue)) return '0 ' + currency;
  
  // Format based on currency type
  if (currency === 'EGP') {
    return numValue.toLocaleString('ar-EG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + ' ' + currency;
  }
  
  // Default SAR formatting
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
