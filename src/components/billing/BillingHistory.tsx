
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const invoices = [
  { date: '2025-04-01', amount: '$29.00', status: 'Paid', id: 'INV-2025-001' },
  { date: '2025-03-01', amount: '$29.00', status: 'Paid', id: 'INV-2025-002' },
  { date: '2025-02-01', amount: '$29.00', status: 'Paid', id: 'INV-2025-003' },
];

const BillingHistory = () => {
  return (
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
  );
};

export default BillingHistory;
