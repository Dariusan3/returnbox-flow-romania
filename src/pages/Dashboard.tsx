
import React from 'react';
import Layout from '@/components/Layout';
import ReturnList from '@/components/ReturnList';

const Dashboard = () => {
  return (
    <Layout showSidebar merchantName="Maria's Fashion Store">
      <div className="max-w-full">
        <ReturnList />
      </div>
    </Layout>
  );
};

export default Dashboard;
