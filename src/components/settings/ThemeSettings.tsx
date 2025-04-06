
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, Monitor, Check } from "lucide-react";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const handleLanguageChange = (value: "ar" | "en") => {
    setLanguage(value);
  };

  // Wait until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">{t('theme_appearance')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`cursor-pointer hover:bg-accent/50 transition-colors ${theme === 'light' ? 'border-primary' : ''}`}>
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2" onClick={() => handleThemeChange('light')}>
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Sun className="h-8 w-8 text-amber-500" />
              </div>
              <RadioGroup defaultValue={theme === 'light' ? 'light' : undefined} onValueChange={handleThemeChange}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">{t('light_mode')}</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer hover:bg-accent/50 transition-colors ${theme === 'dark' ? 'border-primary' : ''}`}>
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2" onClick={() => handleThemeChange('dark')}>
              <div className="h-20 w-20 rounded-full bg-gray-800 flex items-center justify-center">
                <Moon className="h-8 w-8 text-blue-400" />
              </div>
              <RadioGroup defaultValue={theme === 'dark' ? 'dark' : undefined} onValueChange={handleThemeChange}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">{t('dark_mode')}</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer hover:bg-accent/50 transition-colors ${theme === 'system' ? 'border-primary' : ''}`}>
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2" onClick={() => handleThemeChange('system')}>
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-800 flex items-center justify-center">
                <Monitor className="h-8 w-8 text-gray-600" />
              </div>
              <RadioGroup defaultValue={theme === 'system' ? 'system' : undefined} onValueChange={handleThemeChange}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">{t('system_default')}</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">{t('color_theme')}</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-10 w-10 rounded-full bg-lime-500" onClick={() => document.body.classList.add('theme-lime')}>
            {theme === 'lime' && <Check className="h-4 w-4 text-white" />}
          </Button>
          <Button variant="outline" className="h-10 w-10 rounded-full bg-green-500" onClick={() => document.body.classList.add('theme-green')}>
            {theme === 'green' && <Check className="h-4 w-4 text-white" />}
          </Button>
          <Button variant="outline" className="h-10 w-10 rounded-full bg-blue-500" onClick={() => document.body.classList.add('theme-blue')}>
            {theme === 'blue' && <Check className="h-4 w-4 text-white" />}
          </Button>
          <Button variant="outline" className="h-10 w-10 rounded-full bg-purple-500" onClick={() => document.body.classList.add('theme-purple')}>
            {theme === 'purple' && <Check className="h-4 w-4 text-white" />}
          </Button>
          <Button variant="outline" className="h-10 w-10 rounded-full bg-rose-500" onClick={() => document.body.classList.add('theme-rose')}>
            {theme === 'rose' && <Check className="h-4 w-4 text-white" />}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">{t('language')}</h3>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('select_language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
