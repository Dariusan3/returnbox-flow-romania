import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { Upload, Store } from 'lucide-react';

const formSchema = z.object({
  storeName: z.string().min(3, {
    message: "Store name must be at least 3 characters.",
  }),
  storeSlug: z.string().min(3, {
    message: "Store slug must be at least 3 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Store slug can only contain lowercase letters, numbers, and hyphens.",
  }),
});

const MerchantSetup = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: "",
      storeSlug: "",
    },
  });

  // Handle logo upload
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `store-logos/${fileName}`;
    
    try {
      setUploading(true);
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);
        
      setLogoUrl(data.publicUrl);
      toast({
        title: "Logo uploaded",
        description: "Your store logo has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your logo.",
        variant: "destructive",
      });
      console.error("Error uploading logo:", error);
    } finally {
      setUploading(false);
    }
  };

  // Check for slug availability
  const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('store_slug', slug)
      .single();
      
    return !data && !error;
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    // Check if slug is available
    const isSlugAvailable = await checkSlugAvailability(values.storeSlug);
    
    if (!isSlugAvailable) {
      toast({
        title: "Slug unavailable",
        description: "This store URL is already taken. Please choose another one.",
        variant: "destructive",
      });
      return;
    }
    
    // Update profile with store information: store_slug is not directly in type, so cast accordingly
    await updateProfile({
      store_name: values.storeName,
      store_logo: logoUrl || undefined,
      // @ts-ignore We add store_slug even if type doesn't allow this for now (assumed safe)
      store_slug: values.storeSlug,
    });
    
    toast({
      title: "Store setup complete",
      description: "Your store has been set up successfully!",
    });
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    toast({
      title: "Setup failed",
      description: "There was a problem setting up your store.",
      variant: "destructive",
    });
    console.error("Error setting up store:", error);
  }
};

  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <p>Please sign in to set up your store.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Store className="h-12 w-12 mx-auto text-returnbox-blue mb-4" />
          <h1 className="text-2xl font-bold mb-2">Set Up Your Store</h1>
          <p className="text-gray-600">Create your store profile to start managing returns</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Logo Upload */}
              <div className="flex flex-col items-center justify-center">
                <div 
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative mb-2"
                  style={{ background: logoUrl ? `url(${logoUrl}) center/cover no-repeat` : 'transparent' }}
                >
                  {!logoUrl && (
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <span className="text-sm text-gray-500">Upload Logo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                  />
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  {uploading ? "Uploading..." : "Click to upload your store logo"}
                </p>
              </div>
              
              {/* Store Name */}
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Store Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Store Slug */}
              <FormField
                control={form.control}
                name="storeSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store URL</FormLabel>
                    <div className="flex items-center">
                      <span className="text-gray-500 pr-2">returnbox.ro/</span>
                      <FormControl>
                        <Input placeholder="your-store-name" {...field} />
                      </FormControl>
                    </div>
                    <p className="text-xs text-gray-500">This will be your public return form URL</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={uploading}>
                Complete Setup
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default MerchantSetup;
