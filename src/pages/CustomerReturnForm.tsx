
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ReturnForm from '@/components/ReturnForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const CustomerReturnForm = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [merchantId, setMerchantId] = React.useState<string | null>(null);
  const [storeName, setStoreName] = React.useState<string>('');
  const [loadingMerchant, setLoadingMerchant] = React.useState(true);

  React.useEffect(() => {
    if (!storeSlug) {
      setLoadingMerchant(false);
      return;
    }
    const fetchMerchant = async () => {
      try {
        // Fetch merchant by store_slug
        const { data, error } = await supabase
          .from('profiles')
          .select('id, store_name')
          .eq('store_name', storeSlug)
          .eq('role', 'merchant')
          .single();
        if (error || !data) {
          throw new Error('Store not found');
        }
        setMerchantId(data.id);
        setStoreName(data.store_name);
      } catch (e) {
        toast({
          title: 'Store not found',
          description: 'We could not find the store you are looking for.',
          variant: 'destructive',
        });
      } finally {
        setLoadingMerchant(false);
      }
    };
    fetchMerchant();
  }, [storeSlug, toast]);

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
          <p className="mb-6 text-gray-600">You need to be logged in as a customer to submit a return request for.</p>
          <Button onClick={() => navigate('/login?role=customer')}>Sign in as Customer</Button>
        </div>
      </Layout>
    );
  }

  if (loadingMerchant) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading store details...</p>
        </div>
      </Layout>
    );
  }

  if (!merchantId || !storeName) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-600">Store not found or unavailable.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReturnForm storeName={storeName} merchantId={merchantId} />
      </div>
    </Layout>
  );
};

export default CustomerReturnForm;
