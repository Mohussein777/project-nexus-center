
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

interface OfficeInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo_url: string | null;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Office name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address is required." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  description: z.string().optional(),
});

export function OfficeSettings() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchOfficeInfo = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('office_settings')
          .select('*')
          .single();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
            website: data.website || "",
            description: data.description || "",
          });
          setLogoUrl(data.logo_url);
        }
      } catch (error) {
        console.error("Error fetching office info:", error);
        toast({
          title: t('error'),
          description: t('error_fetching_office_info'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOfficeInfo();
  }, [form, toast, t]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('office_settings')
        .upsert({
          id: '1', // Single record for office settings
          name: values.name,
          address: values.address,
          phone: values.phone || null,
          email: values.email || null,
          website: values.website || null,
          description: values.description || null,
          logo_url: logoUrl,
        });
      
      if (error) throw error;
      
      toast({
        title: t('success'),
        description: t('office_settings_updated'),
      });
    } catch (error) {
      console.error("Error updating office info:", error);
      toast({
        title: t('error'),
        description: t('error_updating_office_info'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    
    setIsLoading(true);
    try {
      // Upload the file to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('office')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from('office')
        .getPublicUrl(fileName);
      
      setLogoUrl(urlData.publicUrl);
      
      toast({
        title: t('success'),
        description: t('logo_uploaded'),
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: t('error'),
        description: t('error_uploading_logo'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('office_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enter_office_name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enter_phone')} {...field} />
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
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('website')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enter_website')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="col-span-1 lg:col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('address')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('enter_address')} 
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="col-span-1 lg:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('enter_description')} 
                        rows={4} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <FormLabel>{t('office_logo')}</FormLabel>
              <div className="mt-2 flex items-center gap-4">
                {logoUrl && (
                  <Card className="p-2 w-24 h-24 overflow-hidden">
                    <img src={logoUrl} alt="Office Logo" className="w-full h-full object-contain" />
                  </Card>
                )}
                <div>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    className="w-full"
                  />
                  <FormDescription>{t('logo_description')}</FormDescription>
                </div>
              </div>
            </div>
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('saving') : t('save_changes')}
          </Button>
        </form>
      </Form>
    </div>
  );
}
