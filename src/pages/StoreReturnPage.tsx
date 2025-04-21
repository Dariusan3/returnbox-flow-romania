import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ReturnForm from '@/components/ReturnForm';
import { useToast } from '@/hooks/use-toast';
// Fix import of LoadingSpinner from default export.
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface StoreData {
  id: string;
  store_name: string;
  store_logo: string | null;
}

const StoreReturnPage = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const { toast } = useToast();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Find merchant by store slug
        const { data, error } = await supabase
          .from('profiles')
          .select('id, store_name, store_logo')
          .eq('store_slug', storeSlug)
          .eq('role', 'merchant')
          .single();
          
        if (error || !data) {
          throw new Error('Store not found');
        }
        
        setStoreData(data);
      } catch (error) {
        console.error('Error fetching store data:', error);
        toast({
          title: 'Store not found',
          description: 'We could not find the store you are looking for.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (storeSlug) {
      fetchStoreData();
    }
  }, [storeSlug, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading store...</p>
      </div>
    );
  }
  
  // If store doesn't exist, show error
  if (!storeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-6">
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="text-returnbox-blue hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="py-8 px-4 bg-returnbox-light-blue bg-opacity-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {storeData.store_logo && (
            <img 
              src={storeData.store_logo} 
              alt={`${storeData.store_name} logo`}
              className="h-16 w-16 mb-4 rounded-lg object-cover"
            />
          )}
          <h1 className="text-3xl font-bold text-center text-gray-900">
            {storeData.store_name}
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Return Portal
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReturnForm storeName={storeData.store_name} merchantId={storeData.id} />
      </div>
      
      <footer className="py-6 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500">
              Powered by <span className="text-returnbox-blue font-semibold">ReturnBox</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreReturnPage;
