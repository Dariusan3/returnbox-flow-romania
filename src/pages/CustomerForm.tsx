
import React from 'react';
import Layout from '@/components/Layout';
import ReturnForm from '@/components/ReturnForm';

const CustomerForm = () => {
  return (
    <Layout merchantName="Maria's Fashion Store">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReturnForm />
      </div>
    </Layout>
  );
};

export default CustomerForm;
