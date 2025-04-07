
import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'SAR' | 'EGP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Get stored currency from localStorage or default to SAR
  const [currency, setCurrency] = useState<Currency>(() => {
    const storedCurrency = localStorage.getItem('currency');
    return (storedCurrency as Currency) || 'SAR';
  });

  // Update localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const value = { currency, setCurrency };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
