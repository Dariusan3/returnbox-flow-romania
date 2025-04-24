import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Store, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MerchantStore {
  id: string;
  store_name: string;
  store_logo: string;
}

const Stores = () => {
  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
        .from('profiles')
        .select('id, store_name, store_logo')
        .eq('role', 'merchant')
        .order('store_name');

        if (error) throw error;
        setStores(data || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load stores',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [toast]);

  const filteredStores = stores.filter(store =>
    store.store_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStoreClick = (store_name: string) => {
    navigate(`/return/${store_name}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Find Your Store
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Search for the store you purchased from to start your return
          </p>
          <div className="w-full max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600">Loading stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {searchQuery
                ? 'No stores found matching your search'
                : 'No stores available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card
                key={store.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleStoreClick(store.store_name)}
              >
                <CardContent className="flex items-center p-6">
                  <div className="flex-shrink-0 mr-4">
                    {store.store_logo ? (
                      <img
                        src={store.store_logo}
                        alt={`${store.store_name} logo`}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <Store className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{store.store_name}</h3>
                    <p className="text-sm text-gray-500">Click to start return</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Stores;