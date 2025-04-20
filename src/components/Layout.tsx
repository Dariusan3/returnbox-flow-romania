
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  merchantName?: string;
}

const Layout = ({ children, showSidebar = false, merchantName }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-returnbox-soft-gray flex flex-col">
      <Navbar merchantName={merchantName} />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className={cn("flex-1 p-4 md:p-6", showSidebar ? "ml-0 md:ml-64" : "")}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
