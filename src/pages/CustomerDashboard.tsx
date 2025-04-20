import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CustomerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleReturnClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login?role=customer&redirect=/customer-form');
    }
  };

  // Mock data for customer returns
  const mockReturns = [
    { id: '1', status: 'pending', product: 'Summer Floral Dress', date: '18 Apr 2025' },
    { id: '2', status: 'approved', product: 'Leather Sneakers - White', date: '10 Apr 2025' },
    { id: '3', status: 'completed', product: 'Denim Jacket - Medium', date: '02 Apr 2025' },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">My Returns</h1>
          <Link to="/customer-form" onClick={handleReturnClick}>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Request New Return
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Returns</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Ready for shipping</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Returns</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReturns.map(returnItem => (
                <div key={returnItem.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{returnItem.product}</p>
                    <p className="text-sm text-muted-foreground">Requested on {returnItem.date}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      returnItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      returnItem.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {mockReturns.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">You haven't made any return requests yet.</p>
                <Link to="/customer-form" onClick={handleReturnClick} className="mt-2 inline-block">
                  <Button variant="outline" size="sm">
                    Request a Return
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;