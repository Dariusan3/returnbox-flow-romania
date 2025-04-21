import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Store, User, Mail, Phone, MapPin, Building, Globe } from 'lucide-react';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMerchant = user?.role === 'merchant';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    navigate(isMerchant ? '/merchant-profile' : '/customer-profile');
  };

  const handleCancel = () => {
    navigate(isMerchant ? '/merchant-profile' : '/customer-profile');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {isMerchant ? 'Edit Store Profile' : 'Edit Profile'}
        </h1>

        <form onSubmit={handleSubmit}>
          {isMerchant && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Name</label>
                    <Input
                      defaultValue={user?.store_name}
                      placeholder="Enter store name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input
                      defaultValue={user?.website}
                      placeholder="Enter website URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Address</label>
                    <Input
                      defaultValue={user?.business_address}
                      placeholder="Enter business address"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input
                      type="email"
                      defaultValue={user?.email}
                      placeholder="Enter contact email"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    defaultValue={user?.name}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    defaultValue={user?.phone}
                    placeholder="Enter phone number"
                  />
                </div>
                {!isMerchant && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      defaultValue={user?.address}
                      placeholder="Enter address"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    defaultValue={user?.email}
                    placeholder="Enter email"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProfile;