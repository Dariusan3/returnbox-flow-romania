
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Package, CreditCard, Users } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { RefundCalculator } from '@/components/RefundCalculator';
import { PickupScheduler } from '@/components/PickupScheduler';
import { ReturnItemProps } from '@/components/ReturnItem';
import { Database } from '@/types/supabase';

interface DashboardStats {
  totalReturns: number;
  pendingReturns: number;
  revenueImpact: number;
  totalCustomers: number;
}

type Return = Database['public']['Tables']['returns']['Row'];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalReturns: 0,
    pendingReturns: 0,
    revenueImpact: 0,
    totalCustomers: 0
  });

  const [returnId, setReturnId] = useState('');
  const [approvedReturns, setApprovedReturns] = useState<Return[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) {
        return;
      }

      try {
        // Fetch total returns
        const { data: returnsData, error: returnsError } = await supabase
          .from('returns')
          .select("*")
          .eq('merchant_id', user.id);

        if (returnsError) throw returnsError;

        // Calculate stats
        const totalReturns = returnsData?.length || 0;
        const pendingReturns = returnsData?.filter(r => r.status === 'pending').length || 0;
        const approvedReturns = returnsData?.filter(r => r.status === 'approved');
        console.log(approvedReturns); // Debugging line
        setApprovedReturns(approvedReturns);

        // Fetch unique customers
        const { data: customersData, error: customersError } = await supabase
          .from('returns')
          .select('customer_email')
          .eq('merchant_id', user.id);

        if (customersError) throw customersError;

        const uniqueCustomers = new Set(customersData?.map(r => r.customer_email));

        // Transform returns data for ReturnItemProps
        setStats({
          totalReturns,
          pendingReturns,
          revenueImpact: totalReturns * 50, // Assuming average return value of $50
          totalCustomers: uniqueCustomers.size
        });
        const returnId = returnsData[2]?.id;
        setReturnId(returnId);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard statistics.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user, toast, loading]);

  if (loading) {
    return (
      <Layout showSidebar merchantName={user?.store_name}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar merchantName={user?.store_name}>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReturns}</div>
              <p className="text-xs text-muted-foreground">All time returns</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenueImpact}</div>
              <p className="text-xs text-muted-foreground">Return-related revenue</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReturns}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Unique customers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RefundCalculator merchantId={user?.id || ''} itemPrice={100} />
          <PickupScheduler 
            returnId={returnId} 
            onScheduled={() => {}} 
            approvedReturns={approvedReturns} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
