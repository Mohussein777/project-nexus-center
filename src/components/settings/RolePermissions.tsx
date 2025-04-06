
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Check, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
}

interface RolePermission {
  role: string;
  modulePermissions: {
    [module: string]: {
      [action: string]: boolean;
    };
  };
}

const modules = [
  'dashboard',
  'projects',
  'clients',
  'employees',
  'financial',
  'settings'
];

const permissionActions = [
  'view',
  'create',
  'edit',
  'delete'
];

export function RolePermissions() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('modules');
  
  // Initialize permissions for each role
  const [rolePermissions, setRolePermissions] = useState<{[role: string]: RolePermission}>({
    admin: {
      role: 'admin',
      modulePermissions: {
        dashboard: { view: true, create: true, edit: true, delete: true },
        projects: { view: true, create: true, edit: true, delete: true },
        clients: { view: true, create: true, edit: true, delete: true },
        employees: { view: true, create: true, edit: true, delete: true },
        financial: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: true },
      }
    },
    manager: {
      role: 'manager',
      modulePermissions: {
        dashboard: { view: true, create: true, edit: true, delete: false },
        projects: { view: true, create: true, edit: true, delete: false },
        clients: { view: true, create: true, edit: true, delete: false },
        employees: { view: true, create: true, edit: true, delete: false },
        financial: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      }
    },
    engineer: {
      role: 'engineer',
      modulePermissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        projects: { view: true, create: false, edit: true, delete: false },
        clients: { view: true, create: false, edit: false, delete: false },
        employees: { view: false, create: false, edit: false, delete: false },
        financial: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      }
    },
    accountant: {
      role: 'accountant',
      modulePermissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        projects: { view: true, create: false, edit: false, delete: false },
        clients: { view: true, create: false, edit: false, delete: false },
        employees: { view: false, create: false, edit: false, delete: false },
        financial: { view: true, create: true, edit: true, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      }
    },
    client_manager: {
      role: 'client_manager',
      modulePermissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        projects: { view: true, create: false, edit: false, delete: false },
        clients: { view: true, create: true, edit: true, delete: false },
        employees: { view: false, create: false, edit: false, delete: false },
        financial: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      }
    },
    employee: {
      role: 'employee',
      modulePermissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        projects: { view: true, create: false, edit: false, delete: false },
        clients: { view: false, create: false, edit: false, delete: false },
        employees: { view: false, create: false, edit: false, delete: false },
        financial: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      }
    },
  });

  const handlePermissionChange = (module: string, action: string, value: boolean) => {
    setRolePermissions(prev => {
      const updatedPermissions = { ...prev };
      updatedPermissions[selectedRole] = {
        ...updatedPermissions[selectedRole],
        modulePermissions: {
          ...updatedPermissions[selectedRole].modulePermissions,
          [module]: {
            ...updatedPermissions[selectedRole].modulePermissions[module],
            [action]: value
          }
        }
      };
      return updatedPermissions;
    });
  };

  const handleSavePermissions = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would save the permissions to the database
      toast({
        title: t('success'),
        description: t('permissions_saved'),
      });
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast({
        title: t('error'),
        description: t('error_saving_permissions'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:w-64">
          <Label htmlFor="role-select">{t('select_role')}</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role-select">
              <SelectValue placeholder={t('select_role')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">{t('admin')}</SelectItem>
              <SelectItem value="manager">{t('manager')}</SelectItem>
              <SelectItem value="engineer">{t('engineer')}</SelectItem>
              <SelectItem value="accountant">{t('accountant')}</SelectItem>
              <SelectItem value="client_manager">{t('client_manager')}</SelectItem>
              <SelectItem value="employee">{t('employee')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSavePermissions} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? t('saving') : t('save_permissions')}
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules">{t('by_module')}</TabsTrigger>
          <TabsTrigger value="matrix">{t('permission_matrix')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="pt-4">
          <div className="space-y-6">
            {modules.map(module => (
              <Card key={module}>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">{t(module)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissionActions.map(action => {
                      const isChecked = rolePermissions[selectedRole]?.modulePermissions[module]?.[action] || false;
                      return (
                        <div key={`${module}-${action}`} className="flex items-center justify-between py-2">
                          <Label htmlFor={`${module}-${action}`} className="flex-1">
                            {t(`permission_${action}`)}
                          </Label>
                          <Switch
                            id={`${module}-${action}`}
                            checked={isChecked}
                            onCheckedChange={(value) => handlePermissionChange(module, action, value)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="matrix" className="pt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">{t('module')}</TableHead>
                    {permissionActions.map(action => (
                      <TableHead key={action} className="text-center">{t(`permission_${action}`)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map(module => (
                    <TableRow key={module}>
                      <TableCell className="font-medium">{t(module)}</TableCell>
                      {permissionActions.map(action => {
                        const isChecked = rolePermissions[selectedRole]?.modulePermissions[module]?.[action] || false;
                        return (
                          <TableCell key={`${module}-${action}`} className="text-center">
                            {isChecked ? (
                              <Check className="h-4 w-4 mx-auto text-green-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-gray-200 mx-auto" />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
