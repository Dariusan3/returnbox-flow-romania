
import React from 'react';
import Layout from '@/components/Layout';
import BillingDashboard from '@/components/BillingDashboard';

const Billing = () => {
  return (
    <Layout showSidebar merchantName="Maria's Fashion Store">
      <div className="max-w-4xl mx-auto">
        <BillingDashboard />
      </div>
    </Layout>
  );
};

export default Billing;
