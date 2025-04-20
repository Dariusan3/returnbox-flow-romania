
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

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

const invoices = [
  { date: '2025-04-01', amount: '$29.00', status: 'Paid', id: 'INV-2025-001' },
  { date: '2025-03-01', amount: '$29.00', status: 'Paid', id: 'INV-2025-002' },
  { date: '2025-02-01', amount: '$29.00', status: 'Paid', id: 'INV-2025-003' },
];

const BillingDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-accent rounded-lg">
            <div className="font-medium">Standard Plan</div>
            <div className="text-sm text-muted-foreground mt-1">Your next billing date is May 1, 2025</div>
          </div>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Invoice ID</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b last:border-0">
                    <td className="py-3">{invoice.date}</td>
                    <td>{invoice.id}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.status}</td>
                    <td>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingDashboard;
