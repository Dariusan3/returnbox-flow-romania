
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'customer' | 'merchant';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Check for role parameter and return redirect path
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    const redirectPath = params.get('redirect');
    
    if (roleParam === 'merchant') {
      setSelectedRole('merchant');
    } else if (roleParam === 'customer') {
      setSelectedRole('customer');
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, selectedRole);
      
      if (success) {
        toast({
          title: "Login successful",
          description: `Welcome back to your ${selectedRole === 'merchant' ? 'dashboard' : 'account'}`,
        });
        
        // Check for redirect parameter
        const params = new URLSearchParams(location.search);
        const redirectPath = params.get('redirect');
        
        // Handle role-based redirection
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          // Redirect based on user role
          if (selectedRole === 'merchant') {
            navigate('/dashboard');
          } else {
            navigate('/customer-dashboard');
          }
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-returnbox-soft-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          <span className="text-returnbox-blue">ReturnBox</span> Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your ReturnBox account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  type="button"
                  variant={selectedRole === 'merchant' ? 'default' : 'outline'}
                  className={`w-full ${selectedRole === 'merchant' ? 'bg-returnbox-blue text-white' : ''}`}
                  onClick={() => setSelectedRole('merchant')}
                >
                  Merchant
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'customer' ? 'default' : 'outline'}
                  className={`w-full ${selectedRole === 'customer' ? 'bg-returnbox-blue text-white' : ''}`}
                  onClick={() => setSelectedRole('customer')}
                >
                  Customer
                </Button>
              </div>
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Signing in...
                    </>
                  ) : "Sign in"}
                </Button>
              </div>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/register">
                    <Button variant="outline" className="w-full">
                      Create an account
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-returnbox-blue hover:underline">
                  Back to home
                </Link>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
