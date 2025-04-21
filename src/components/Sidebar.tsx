
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Package, Settings, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [pendingReturns, setPendingReturns] = useState(0);

  useEffect(() => {
    const fetchPendingReturns = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('returns')
          .select('*')
          .eq('merchant_id', user.id)
          .eq('status', 'pending');

        if (error) throw error;
        setPendingReturns(data?.length || 0);
      } catch (error) {
        console.error('Error fetching pending returns:', error);
      }
    };

    fetchPendingReturns();

    // Subscribe to changes in the returns table
    const subscription = supabase
      .channel('returns_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'returns' },
        () => fetchPendingReturns()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  const menuItems = [
    { name: 'Dashboard', icon: <BarChart size={20} />, path: '/dashboard' },
    { name: 'Returns', icon: <Package size={20} />, path: '/returns' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { name: 'Billing', icon: <CreditCard size={20} />, path: '/billing' },
  ];
  
  const initials = user?.store_name
    ? user.store_name.substring(0, 2).toUpperCase()
    : 'ST';
  
  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full pt-5">
      <div className="space-y-6 px-4">
        <div className="space-y-3">
          <h3 className="text-xs uppercase text-gray-500 font-semibold px-3">
            Main Menu
          </h3>
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200",
                location.pathname === item.path
                  ? "bg-returnbox-light-blue text-returnbox-blue font-medium"
                  : "text-gray-600 hover:bg-returnbox-soft-gray"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.name === 'Returns' && pendingReturns > 0 && (
                <span className="ml-auto bg-returnbox-blue text-white text-xs px-2 py-1 rounded-full">
                  {pendingReturns}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-returnbox-light-blue flex items-center justify-center text-returnbox-blue font-medium overflow-hidden">
            {user?.store_logo ? (
              <img 
                src={user.store_logo} 
                alt={user.store_name || 'Store'}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.store_name || 'Your Store'}</p>
            <p className="text-xs text-gray-500">Merchant</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
