import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Customer fields
  const [firstName, setFirstName] = useState<string>(user?.first_name || '');
  const [lastName, setLastName] = useState<string>(user?.last_name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [address, setAddress] = useState<string>(user?.address || '');

  // Merchant fields
  const [storeName, setStoreName] = useState<string>(user?.store_name || '');
  const [website, setWebsite] = useState<string>(user?.website || '');
  const [businessAddress, setBusinessAddress] = useState<string>(user?.business_address || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profileData = user?.role === 'customer' ? {
        first_name: firstName,
        last_name: lastName,
        phone,
        address
      } : {
        store_name: storeName,
        website,
        business_address: businessAddress
      };

      await updateProfile(profileData);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });

      navigate(user?.role === 'merchant' ? '/dashboard' : '/customer-dashboard');
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-returnbox-soft-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          <span className="text-returnbox-blue">Edit Profile</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Update your {user.role} profile information
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {user.role === 'customer' ? (
              // Customer profile fields
              <>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="mt-1">
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="mt-1">
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="mt-1">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <div className="mt-1">
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              // Merchant profile fields
              <>
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <div className="mt-1">
                    <Input
                      id="storeName"
                      name="storeName"
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="mt-1">
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <div className="mt-1">
                    <Input
                      id="businessAddress"
                      name="businessAddress"
                      type="text"
                      required
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;