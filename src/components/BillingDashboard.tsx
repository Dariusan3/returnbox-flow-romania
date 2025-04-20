
import React from 'react';
import CurrentPlan from './billing/CurrentPlan';
import PricingPlans from './billing/PricingPlans';
import BillingHistory from './billing/BillingHistory';

const BillingDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <CurrentPlan />
      <PricingPlans />
      <BillingHistory />
    </div>
  );
};

export default BillingDashboard;
