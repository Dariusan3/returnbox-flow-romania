import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { X, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SettingsForm = () => {
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, updateStoreLogo } = useAuth();
  
  // Use logo from auth context if available
  React.useEffect(() => {
    if (user?.store_logo) {
      setUploadedLogo(user.store_logo);
    }
  }, [user]);
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const logoUrl = reader.result as string;
        setUploadedLogo(logoUrl);
        updateStoreLogo(logoUrl);
        toast({
          title: "Logo updated",
          description: "Your store logo has been updated successfully."
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeLogo = () => {
    setUploadedLogo(null);
    updateStoreLogo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Logo removed",
      description: "Your store logo has been removed."
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Store Logo</label>
            <div className="mt-1">
              {uploadedLogo ? (
                <div className="relative inline-block">
                  <img 
                    src={uploadedLogo} 
                    alt="Store Logo" 
                    className="w-32 h-32 object-cover rounded-lg border" 
                  />
                  <button 
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 w-32 h-32">
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload logo</span>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Recommended size: 512x512px</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name</label>
            <Input placeholder="Your business name" defaultValue={user?.store_name || ""} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Return Email</label>
            <Input placeholder="returns@yourbusiness.com" type="email" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Processing Time (Days)</label>
            <Input type="number" defaultValue={3} min={1} max={14} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Return Reasons</label>
            <div className="space-y-2">
              <Input placeholder="Add new reason" />
              <div className="space-y-2">
                {["Size issue", "Quality issue", "Changed mind", "Wrong item"].map((reason) => (
                  <div key={reason} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>{reason}</span>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto-approve returns</label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Email notifications</label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsForm;
