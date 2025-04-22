
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  merchantName?: string;
}

const Layout = ({ children, showSidebar = false, merchantName }: LayoutProps) => {
  const { user } = useAuth();
  
  // Use merchant name from auth context if available, otherwise use prop
  const displayMerchantName = user?.role === 'merchant' ? user.store_name : merchantName;
  
  return (
    <div className="min-h-screen bg-returnbox-soft-gray flex flex-col">
      <Navbar merchantName={displayMerchantName} />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className={cn("flex-1 p-4 md:p-6", showSidebar ? "ml-0 md:ml-16" : "")}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
