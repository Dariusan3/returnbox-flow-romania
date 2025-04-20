
import React from 'react';
import { useEffect } from'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, BarChart, LogIn, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Add navigation buttons for authenticated users
  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return null;
    const dashboardPath = user.role === 'merchant' ? '/dashboard' : '/customer-dashboard';
    return (
      <Link to={dashboardPath}>
        <Button className="text-lg px-6 py-6">
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    );
  };

  const handleReturnClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login?role=customer&redirect=/customer-form');
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-returnbox-light-blue py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-returnbox-blue">ReturnBox</span> - Simplify Product Returns
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              The easiest way for Romanian online stores to manage product returns
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <Link to="/customer-form" onClick={handleReturnClick}>
                  <Button className="text-lg px-6 py-6">
                    Request a Return
                    <Package className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="text-lg px-6 py-6">
                    Login
                    <LogIn className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            ) : user.role === 'customer' ? (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                {getDashboardLink()}
                <Link to="/customer-form">
                  <Button variant="outline" className="text-lg px-6 py-6">
                    New Return Request
                    <Package className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )
            : getDashboardLink()
          }
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How ReturnBox Works</h2>
            <p className="mt-4 text-xl text-gray-600">Simple, efficient returns management for both customers and merchants</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-returnbox-light-blue rounded-full flex items-center justify-center mb-4">
                <span className="text-returnbox-blue text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Requests Return</h3>
              <p className="text-gray-600">
                Customers fill out a simple form with their order details and reason for return.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-returnbox-light-blue rounded-full flex items-center justify-center mb-4">
                <span className="text-returnbox-blue text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Merchant Reviews</h3>
              <p className="text-gray-600">
                Merchants review and approve return requests through an intuitive dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-returnbox-light-blue rounded-full flex items-center justify-center mb-4">
                <span className="text-returnbox-blue text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AWB Generated</h3>
              <p className="text-gray-600">
                Generate shipping labels automatically and track return packages in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="bg-returnbox-soft-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Path</h2>
            <p className="mt-4 text-xl text-gray-600">ReturnBox serves both customers and merchants</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Path */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-returnbox-light-blue rounded-full mb-6">
                <ShoppingBag className="h-8 w-8 text-returnbox-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Customers</h3>
              <p className="text-gray-600 mb-6">
                Need to return a purchase? Use our simple return form to request a return from any ReturnBox merchant.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">No account required</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Easy-to-use return form</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Instant confirmation</p>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/customer-form" onClick={handleReturnClick}>
                  <Button className="w-full">
                    Start a Return
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Merchant Path */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-returnbox-light-blue rounded-full mb-6">
                <BarChart className="h-8 w-8 text-returnbox-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Merchants</h3>
              <p className="text-gray-600 mb-6">
                Own an online store? Streamline your return process with our merchant dashboard.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Customizable return portal</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Manage all returns in one place</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Detailed analytics</p>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/register?role=merchant">
                  <Button variant="outline" className="w-full">
                    Create Merchant Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-returnbox-light-blue rounded-xl shadow-lg p-8 md:p-12 md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Ready to simplify your returns?</h2>
              <p className="text-gray-600">Join thousands of Romanian online stores using ReturnBox</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-returnbox-blue font-bold text-xl">ReturnBox</span>
                <p className="text-gray-500 mt-2">© 2025 ReturnBox. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Terms
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Privacy
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
