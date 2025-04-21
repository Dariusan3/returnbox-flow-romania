import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Upload, Package, Check } from 'lucide-react';

const formSchema = z.object({
  orderId: z.string().min(3, {
    message: "Order ID must be at least 3 characters.",
  }),
  productName: z.string().min(3, {
    message: "Product name must be at least 3 characters.",
  }),
  reason: z.string().min(10, {
    message: "Please provide a more detailed reason for the return.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

interface ReturnFormProps {
  storeName: string;
  merchantId: string;
}

const ReturnForm = ({ storeName, merchantId }: ReturnFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: "",
      productName: "",
      reason: "",
      email: user?.email || "",
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    
    const file = event.target.files[0];
    setPhotoFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;
    
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `return-photos/${fileName}`;
    
    try {
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('returns')
        .upload(filePath, photoFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('returns')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading photo:", error);
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    
    try {
      // Upload photo if exists
      const photoUrl = await uploadPhoto();
      
      // Save return request to Supabase
      const { error } = await supabase
        .from('returns')
        .insert([
          {
            merchant_id: merchantId,
            order_id: values.orderId,
            product_name: values.productName,
            reason: values.reason,
            customer_email: values.email,
            photo_url: photoUrl,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
        ]);
        
      if (error) throw error;
      
      setSubmitted(true);
      toast({
        title: 'Return request submitted',
        description: 'Your return request has been sent to the merchant.',
      });
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast({
        title: 'Submission failed',
        description: 'There was a problem submitting your return request.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Return Request Submitted</h2>
        <p className="text-gray-600 mb-6">
          Your return request has been sent to {storeName}. They will review it and get back to you soon.
        </p>
        <Button onClick={() => setSubmitted(false)}>Submit Another Return</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Submit a Return Request for {storeName}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Order ID */}
          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your order number" {...field} />
                </FormControl>
                <FormDescription>
                  This can be found on your order confirmation email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Product Name */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Return Reason */}
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Return</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please explain why you're returning this item"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="your@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Photo Upload (Optional) */}
          <div className="space-y-2">
            <FormLabel>Upload Photo (Optional)</FormLabel>
            <div className="flex items-center space-x-4">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview}
                    alt="Product preview"
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Add photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handlePhotoChange}
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  Upload a photo of the product you're returning (optional).
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={submitting}
          >
            {submitting ? (
              <>
                <LoadingSpinner className="mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                Submit Return Request
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReturnForm;
