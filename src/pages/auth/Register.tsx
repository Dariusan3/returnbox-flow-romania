
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

type RegisterStep = 'role' | 'form';
type UserRole = 'customer' | 'merchant';

const Register = () => {
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Customer fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Merchant fields
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<RegisterStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>('merchant');
  const location = useLocation();
  
  // Check URL parameters for role preselection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    
    if (roleParam === 'customer') {
      setSelectedRole('customer');
      setCurrentStep('form');
    } else if (roleParam === 'merchant') {
      setSelectedRole('merchant');
      setCurrentStep('form');
    }
  }, [location]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('form');
  };

  const handleBack = () => {
    setCurrentStep('role');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid email or password');
      }

      const userData = selectedRole === 'customer' ? {
        first_name: firstName,
        last_name: lastName,
        phone,
        address
      } : {
        store_name: storeName,
        website,
        business_address: businessAddress
      };

      const success = await register(email, password, selectedRole, userData);
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
        // Navigate to email confirmation page with necessary data
        navigate('/email-confirmation', {
          state: { email, password, role: selectedRole }
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update store URL as user types store name
  React.useEffect(() => {
    if (storeName) {
      const formattedUrl = storeName.toLowerCase().replace(/\s+/g, '-');
      setStoreUrl(formattedUrl);
    } else {
      setStoreUrl('');
    }
  }, [storeName]);

  return (
    <div className="min-h-screen bg-returnbox-soft-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          <span className="text-returnbox-blue">ReturnBox</span> Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {currentStep === 'role' 
            ? 'Choose your account type to continue' 
            : `Create your ${selectedRole} account`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {currentStep === 'role' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${selectedRole === 'merchant' ? 'border-returnbox-blue bg-returnbox-light-blue' : 'hover:border-gray-400'}`}
                  onClick={() => setSelectedRole('merchant')}
                >
                  <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-returnbox-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Merchant</h3>
                  <p className="text-sm text-gray-500 mt-2">Manage your store's returns</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${selectedRole === 'customer' ? 'border-returnbox-blue bg-returnbox-light-blue' : 'hover:border-gray-400'}`}
                  onClick={() => setSelectedRole('customer')}
                >
                  <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-returnbox-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Customer</h3>
                  <p className="text-sm text-gray-500 mt-2">Return products easily</p>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleRoleSelect(selectedRole)}
              >
                Continue
              </Button>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleRegister}>
              {selectedRole === 'customer' ? (
                // Customer registration fields
                <>
                  <div className="grid grid-cols-2 gap-4">
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
                // Merchant registration fields
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
                    <Label htmlFor="storeUrl">Your Return Page URL</Label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        returnbox.ro/
                      </span>
                      <Input
                        id="storeUrl"
                        name="storeUrl"
                        className="rounded-l-none"
                        value={storeUrl}
                        readOnly
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      This will be your customers' return page URL
                    </p>
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
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating account...
                  </>
                ) : "Create account"}
              </Button>
            </div>
          </form>
          )}
        </div>
        </div>
      </div>
  );
};

export default Register;
