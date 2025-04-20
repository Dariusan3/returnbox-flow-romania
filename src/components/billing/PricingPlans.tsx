
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    features: ['Up to 50 returns/month', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Standard',
    price: '29',
    features: ['Up to 500 returns/month', 'Advanced analytics', 'Priority support', 'Custom branding'],
  },
  {
    name: 'Premium',
    price: '99',
    features: ['Unlimited returns', 'API access', '24/7 support', 'Custom integration', 'Bulk processing'],
  },
];

const PricingPlans = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {pricingPlans.map((plan) => (
        <Card key={plan.name} className="relative">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <div className="text-2xl font-bold">${plan.price}/mo</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4" variant={plan.name === 'Standard' ? 'secondary' : 'outline'}>
              {plan.name === 'Standard' ? 'Current Plan' : 'Upgrade'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingPlans;
