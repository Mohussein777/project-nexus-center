
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
