
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Plus, Search, Trash2, UserPlus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
}

const userRoles = ['admin', 'manager', 'engineer', 'accountant', 'client_manager', 'employee'];
const departments = ['management', 'engineering', 'accounting', 'sales', 'hr', 'it'];

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
  role: z.string().min(1, { message: "Please select a role." }),
  department: z.string().min(1, { message: "Please select a department." }),
  status: z.enum(['active', 'inactive']),
});

export function UserManagement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      department: "",
      status: "active" as const,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser && isEditUserOpen) {
      form.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        department: selectedUser.department,
        status: selectedUser.status,
      });
    }
  }, [selectedUser, isEditUserOpen, form]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would fetch users from the users table
      // For now, we'll use mock data
      const mockUsers: User[] = [
        { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', role: 'admin', department: 'management', status: 'active' },
        { id: '2', name: 'محمد علي', email: 'mohammed@example.com', role: 'engineer', department: 'engineering', status: 'active' },
        { id: '3', name: 'سارة أحمد', email: 'sara@example.com', role: 'accountant', department: 'accounting', status: 'active' },
        { id: '4', name: 'فاطمة محمود', email: 'fatima@example.com', role: 'client_manager', department: 'sales', status: 'active' },
        { id: '5', name: 'خالد عبدالله', email: 'khaled@example.com', role: 'employee', department: 'engineering', status: 'inactive' },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: t('error'),
        description: t('error_fetching_users'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t(user.role).toLowerCase().includes(searchQuery.toLowerCase()) ||
    t(user.department).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (data: z.infer<typeof userFormSchema>) => {
    // In a real application, this would add a user to the database
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      status: data.status,
    };
    
    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
    form.reset();
    
    toast({
      title: t('success'),
      description: t('user_added_successfully'),
    });
  };

  const handleEditUser = (data: z.infer<typeof userFormSchema>) => {
    if (!selectedUser) return;
    
    // In a real application, this would update a user in the database
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { ...user, ...data } : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    setSelectedUser(null);
    
    toast({
      title: t('success'),
      description: t('user_updated_successfully'),
    });
  };

  const handleDeleteUser = (userId: string) => {
    // In a real application, this would delete a user from the database
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    toast({
      title: t('success'),
      description: t('user_deleted_successfully'),
    });
  };

  const openEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'manager': return 'bg-blue-500';
      case 'engineer': return 'bg-green-500';
      case 'accountant': return 'bg-amber-500';
      case 'client_manager': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search_users')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="md:w-auto w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              {t('add_user')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('add_new_user')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter_name')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter_email')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('enter_password')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('role')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_role')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {userRoles.map(role => (
                              <SelectItem key={role} value={role}>{t(role)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('department')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_department')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{t(dept)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('status')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_status')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">{t('active')}</SelectItem>
                          <SelectItem value="inactive">{t('inactive')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddUserOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? t('saving') : t('save')}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>{t('role')}</TableHead>
                <TableHead>{t('department')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">{t('loading')}</TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">{t('no_users_found')}</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                        {t(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>{t(user.department)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(user.status)} text-white`}>
                        {t(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t('edit')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('delete')}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('edit_user')}</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {selectedUser && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEditUser)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enter_name')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enter_email')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('role')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_role')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {userRoles.map(role => (
                              <SelectItem key={role} value={role}>{t(role)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('department')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_department')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{t(dept)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('status')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_status')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">{t('active')}</SelectItem>
                            <SelectItem value="inactive">{t('inactive')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditUserOpen(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? t('saving') : t('save_changes')}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
