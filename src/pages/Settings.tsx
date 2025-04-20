
import React from 'react';
import Layout from '@/components/Layout';
import SettingsForm from '@/components/SettingsForm';

const Settings = () => {
  return (
    <Layout showSidebar merchantName="Maria's Fashion Store">
      <div className="max-w-3xl mx-auto">
        <SettingsForm />
      </div>
    </Layout>
  );
};

export default Settings;
