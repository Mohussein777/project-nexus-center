
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/contexts/CurrencyContext";
import { DollarSign, PoundSterling } from "lucide-react";

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          {currency === 'SAR' ? (
            <DollarSign className="h-4 w-4" />
          ) : (
            <PoundSterling className="h-4 w-4" />
          )}
          <span>{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency('SAR')}>
          <DollarSign className="h-4 w-4 mr-2" />
          <span>ريال سعودي (SAR)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency('EGP')}>
          <PoundSterling className="h-4 w-4 mr-2" />
          <span>جنيه مصري (EGP)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
