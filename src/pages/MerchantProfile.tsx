import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, User, Mail, Phone, MapPin, Building, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MerchantProfile = () => {
  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Store Profile</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Store Name</label>
                <p className="text-lg font-medium">{user?.store_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Website</label>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {user?.website || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Business Address</label>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {user?.business_address || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Contact Email</label>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Store Details
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Owner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user?.phone || 'Not provided'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Personal Info
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Return Portal Settings</h3>
                <p className="text-sm text-gray-500">Customize your return portal appearance</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notification Preferences</h3>
                <p className="text-sm text-gray-500">Manage email and system notifications</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-gray-500">Permanently remove your store account</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MerchantProfile;