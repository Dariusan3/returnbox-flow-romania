
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, BarChart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
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
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link to="/customer-form">
                <Button className="text-lg px-6 py-6">
                  Request a Return
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="text-lg px-6 py-6">
                  Merchant Dashboard
                  <BarChart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
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

      {/* CTA Section */}
      <div className="bg-returnbox-soft-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Ready to simplify your returns?</h2>
              <p className="text-gray-600">Join thousands of Romanian online stores using ReturnBox</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/customer-form">
                <Button className="w-full sm:w-auto">
                  Request a Return
                  <Package className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full sm:w-auto">
                  Merchant Login
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
