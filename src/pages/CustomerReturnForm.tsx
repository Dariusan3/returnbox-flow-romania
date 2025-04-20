
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ReturnForm from '@/components/ReturnForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const CustomerReturnForm = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect merchants away from the return form
  useEffect(() => {
    if (user && user.role === 'merchant') {
      toast({
        title: "Access restricted",
        description: "Merchants cannot submit return requests. Please use your dashboard instead.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to request a return</h2>
          <p className="mb-6 text-gray-600">You need to be logged in as a customer to submit a return request.</p>
          <Button onClick={() => navigate('/login?role=customer')}>Sign in as Customer</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReturnForm />
      </div>
    </Layout>
  );
};

export default CustomerReturnForm;
