
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart, Package, Settings, CreditCard } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: <BarChart size={20} />, path: '/dashboard' },
    { name: 'Returns', icon: <Package size={20} />, path: '/returns' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { name: 'Billing', icon: <CreditCard size={20} />, path: '/billing' },
  ];
  
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
              {item.name === 'Returns' && (
                <span className="ml-auto bg-returnbox-blue text-white text-xs px-2 py-1 rounded-full">
                  5
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-returnbox-light-blue flex items-center justify-center text-returnbox-blue font-medium">
            MS
          </div>
          <div>
            <p className="text-sm font-medium">Maria Shop</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
