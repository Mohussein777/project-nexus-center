
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export function ThemeSettings() {
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('system');
  const [accentColor, setAccentColor] = useState('blue');
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const handleSaveThemeSettings = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would save the theme settings to the database
      // For now, we'll just show a success toast
      toast({
        title: t('success'),
        description: t('theme_settings_saved'),
      });
    } catch (error) {
      console.error("Error saving theme settings:", error);
      toast({
        title: t('error'),
        description: t('error_saving_theme_settings'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">{t('appearance')}</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-base">{t('theme')}</Label>
            <RadioGroup 
              value={theme} 
              onValueChange={setTheme}
              className="flex flex-col space-y-3 mt-2"
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">{t('light')}</Label>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">{t('dark')}</Label>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">{t('system')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-base" htmlFor="accent-color">{t('accent_color')}</Label>
            <Select 
              id="accent-color" 
              value={accentColor} 
              onValueChange={setAccentColor}
              className="mt-2"
            >
              <SelectTrigger>
                <SelectValue placeholder={t('select_accent_color')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">{t('blue')}</SelectItem>
                <SelectItem value="green">{t('green')}</SelectItem>
                <SelectItem value="purple">{t('purple')}</SelectItem>
                <SelectItem value="orange">{t('orange')}</SelectItem>
                <SelectItem value="red">{t('red')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">{t('language')}</h3>
        <div>
          <Label className="text-base" htmlFor="language">{t('select_language')}</Label>
          <Select 
            id="language" 
            value={language} 
            onValueChange={setLanguage}
            className="mt-2"
          >
            <SelectTrigger>
              <SelectValue placeholder={t('select_language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">{t('accessibility')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="animations" className="flex-1">
              {t('enable_animations')}
              <p className="text-sm text-muted-foreground">{t('enable_animations_description')}</p>
            </Label>
            <Switch
              id="animations"
              checked={enableAnimations}
              onCheckedChange={setEnableAnimations}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="flex-1">
              {t('high_contrast_mode')}
              <p className="text-sm text-muted-foreground">{t('high_contrast_mode_description')}</p>
            </Label>
            <Switch
              id="high-contrast"
              checked={highContrastMode}
              onCheckedChange={setHighContrastMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion" className="flex-1">
              {t('reduced_motion')}
              <p className="text-sm text-muted-foreground">{t('reduced_motion_description')}</p>
            </Label>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={handleSaveThemeSettings} disabled={isLoading} className="w-full md:w-auto">
        <Save className="mr-2 h-4 w-4" />
        {isLoading ? t('saving') : t('save_settings')}
      </Button>
    </div>
  );
}
