
import React from 'react';
import Layout from '@/components/Layout';
import ReturnForm from '@/components/ReturnForm';

const CustomerForm = () => {
  // This page requires storeName and merchantId props to ReturnForm, but values not received here.
  // For now, we can show a fallback or redirect. 
  // We will show a message and no form here to avoid errors.
  return (
    <Layout merchantName="Maria's Fashion Store">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">No return form available here, please access via your store's public URL.</p>
      </div>
    </Layout>
  );
};

export default CustomerForm;
