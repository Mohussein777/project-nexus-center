
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OfficeSettings } from "@/components/settings/OfficeSettings";
import { UserManagement } from "@/components/settings/UserManagement";
import { RolePermissions } from "@/components/settings/RolePermissions";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { Building2, Users, ShieldCheck, Palette } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("office");
  
  // Update document title
  useEffect(() => {
    document.title = `${t('settings')} | ${t('dashboard')}`;
  }, [t]);

  return (
    <MainLayout>
      <div className="container py-6 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
          <p className="text-muted-foreground mt-2">{t('settings_description')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-[600px] w-full">
            <TabsTrigger value="office" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Building2 className="h-4 w-4" />
              <span>{t('office_settings')}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="h-4 w-4" />
              <span>{t('users')}</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center space-x-2 rtl:space-x-reverse">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('roles')}</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Palette className="h-4 w-4" />
              <span>{t('theme')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="office">
            <Card>
              <CardHeader>
                <CardTitle>{t('office_settings')}</CardTitle>
                <CardDescription>{t('office_settings_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <OfficeSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t('user_management')}</CardTitle>
                <CardDescription>{t('user_management_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>{t('role_permissions')}</CardTitle>
                <CardDescription>{t('role_permissions_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <RolePermissions />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>{t('theme_settings')}</CardTitle>
                <CardDescription>{t('theme_settings_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
