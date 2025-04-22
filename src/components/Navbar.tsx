
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bell, Menu, User, LogIn, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import {Navigate} from 'react-router-dom';

interface NavbarProps {
  merchantName?: string;
}

const Navbar = ({ merchantName: propMerchantName }: NavbarProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleReturnClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login?role=customer&redirect=/customer-form');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Determine if user is on a merchant-specific page
  const isMerchantPage = ['/dashboard', '/returns', '/settings', '/billing'].includes(location.pathname);
  
  // Use auth context to determine if user is logged in
  const isLoggedIn = isAuthenticated;
  
  // Use merchant name from auth context if available, otherwise use prop
  const merchantName = user?.store_name || propMerchantName;
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="sm" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center">
              <span className="text-returnbox-blue font-bold text-xl">ReturnBox</span>
              {merchantName && (
                <>
                  <span className="text-gray-400 mx-2">|</span>
                  <span className="text-gray-600">{merchantName}</span>
                </>
              )}
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Show Return Request button only for customers or non-logged in users */}
            {(!isLoggedIn || (user && user.role === 'customer')) && (
              <Link to="/stores" onClick={handleReturnClick}>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Request Return
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Link to={user?.role === 'merchant' ? '/dashboard' : '/customer-dashboard'}>
                <Button variant="ghost" size="sm" className="flex items-center">
                  Dashboard
                </Button>
              </Link>
            )}
            
            {isLoggedIn ? (
              <>
                {user?.role === 'merchant' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          3
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>New return request from Ana P.</DropdownMenuItem>
                      <DropdownMenuItem>Return #23492 approved</DropdownMenuItem>
                      <DropdownMenuItem>Package arrived at warehouse</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to={user?.role === 'merchant' ? '/merchant-profile' : '/customer-profile'} className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'merchant' && (
                      <DropdownMenuItem>
                        <Link to="/settings" className="w-full">Settings</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <span className="w-full">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
