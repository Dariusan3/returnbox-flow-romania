
import React from 'react';
import { useParams } from 'react-router-dom';
import ReturnForm from '@/components/ReturnForm';
import { useToast } from '@/hooks/use-toast';

// Mock store data for demo purposes
const mockStores = [
  { 
    name: 'magazinul-meu', 
    displayName: 'Magazinul Meu', 
    logo: '/placeholder.svg',
    primaryColor: '#9b87f5'
  },
  { 
    name: 'marias-fashion', 
    displayName: "Maria's Fashion Store", 
    logo: '/placeholder.svg',
    primaryColor: '#4a6cf7'
  },
];

const StoreReturnPage = () => {
  const { storeName } = useParams<{ storeName: string }>();
  const { toast } = useToast();
  
  // Find store by URL name
  const storeData = mockStores.find(store => store.name === storeName);
  
  // If store doesn't exist, show error
  if (!storeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-6">
            The store you're looking for doesn't exist or has been removed.
          </p>
          <a href="/" className="text-returnbox-blue hover:underline">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div 
        className="py-8 px-4" 
        style={{ backgroundColor: `${storeData.primaryColor}15` }} // Very light version of the primary color
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <img 
            src={storeData.logo} 
            alt={`${storeData.displayName} logo`}
            className="h-16 w-16 mb-4 rounded-lg"
          />
          <h1 className="text-3xl font-bold text-center text-gray-900">
            {storeData.displayName}
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Return Portal
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReturnForm storeName={storeData.displayName} />
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
