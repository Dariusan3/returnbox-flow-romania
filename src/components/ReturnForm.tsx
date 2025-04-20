
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from './ui/LoadingSpinner';
import { X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReturnFormProps {
  storeName?: string;
}

const ReturnForm = ({ storeName = "ReturnBox Store" }: ReturnFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Return request submitted",
        description: "You'll receive a confirmation email shortly.",
      });
    }, 1500);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setUploadedImage(null);
  };
  
  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md my-8 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Return Request Submitted</h2>
          <p className="text-gray-600 mb-6">
            Your return request has been submitted successfully. You'll receive a confirmation email with further instructions.
          </p>
          <p className="text-sm text-gray-500 mb-4">Return ID: #RT45678</p>
          <Button onClick={() => setSubmitted(false)}>Submit Another Return</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md my-8 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6">
        Request a Return for {storeName}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="orderNumber">Order Number</Label>
          <Input id="orderNumber" placeholder="e.g. 123456" required />
        </div>
        
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your full name" required />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" required />
        </div>
        
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input id="productName" placeholder="e.g. Blue T-Shirt" required />
        </div>
        
        <div>
          <Label htmlFor="reason">Reason for Return</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="size">Size Issue</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
              <SelectItem value="changed_mind">Changed Mind</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="details">Additional Details</Label>
          <Textarea id="details" placeholder="Provide more information about your return" />
        </div>
        
        <div>
          <Label htmlFor="photo">Upload Photo (optional)</Label>
          <div className="mt-1">
            {uploadedImage ? (
              <div className="relative inline-block">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="w-32 h-32 object-cover rounded-lg border" 
                />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                  <input 
                    type="file" 
                    id="photo" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : "Request Return"}
        </Button>
      </form>
    </div>
  );
};

export default ReturnForm;
