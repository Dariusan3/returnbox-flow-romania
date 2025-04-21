
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ReturnForm from '@/components/ReturnForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';

const CustomerForm = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        if (!storeSlug) {
          navigate('/');
          return;
        }

        console.log('Fetching store with slug:', storeSlug);

        // First try with the exact slug
        let { data, error } = await supabase
          .from('profiles')
          .select('id, store_name')
          .eq('store_slug', storeSlug)
          .single();

        // If not found, try case-insensitive search
        if (error || !data) {
          console.log('Exact slug not found, trying case-insensitive search');
          const { data: allMerchants, error: merchError } = await supabase
            .from('merchants')
            .select('id, store_name, store_slug');
            
          if (!merchError && allMerchants) {
            // Find a match ignoring case
            const merchant = allMerchants.find(m => 
              m.store_slug && m.store_slug.toLowerCase() === storeSlug.toLowerCase()
            );
            
            if (merchant) {
              data = merchant;
              error = null;
            }
          }
        }

        if (error || !data) {
          // As a fallback, try to match by store name
          console.log('Trying to match by store name...');
          const { data: storeData, error: storeError } = await supabase
            .from('merchants')
            .select('id, store_name')
            .ilike('store_name', `%${storeSlug}%`)
            .single();
            
          if (!storeError && storeData) {
            data = storeData;
            error = null;
          } else {
            throw new Error('Store not found');
          }
        }

        console.log('Found store:', data);
        setMerchantId(data.id);
        setStoreName(data.store_name || 'Store');
      } catch (error) {
        console.error('Error fetching store data:', error);
        toast({
          title: 'Store not found',
          description: 'We could not find the store you are looking for. Please check the URL and try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeSlug, toast, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
          <p className="ml-2 text-gray-600">Loading store details...</p>
        </div>
      </Layout>
    );
  }

  if (!merchantId || !storeName) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-600 mb-4">Store not found or unavailable.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout merchantName={storeName}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReturnForm storeName={storeName} merchantId={merchantId} />
      </div>
    </Layout>
  );
};

export default CustomerForm;
