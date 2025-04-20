import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'customer' | 'merchant' | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  address?: string;
  storeName?: string;
  storeLogo?: string;
  website?: string;
  businessAddress?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateStoreLogo: (logoUrl: string) => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('returnbox_user', JSON.stringify(updatedUser));
    }
  };
  
  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('returnbox_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('returnbox_user');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // This would be replaced with an actual API call in a real application
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just check if email contains @ and password is not empty
      if (email.includes('@') && password.length > 0) {
        // Get stored user data if exists
        const storedUserData = localStorage.getItem('returnbox_user');
        let storedRole = role;
        
        if (storedUserData) {
          const storedUser = JSON.parse(storedUserData);
          storedRole = storedUser.role || role;
        }

        // Get user data from localStorage during registration
        const registrationData = localStorage.getItem('registration_data');
        const userData = registrationData ? JSON.parse(registrationData) : {};
        
        const newUser: User = {
          id: '123',
          email,
          role: storedRole,
          ...userData
        };
        
        // Clean up registration data
        localStorage.removeItem('registration_data');
        
        setUser(newUser);
        localStorage.setItem('returnbox_user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('returnbox_user');
  };

  const updateStoreLogo = (logoUrl: string) => {
    if (user && user.role === 'merchant') {
      const updatedUser = { ...user, storeLogo: logoUrl };
      setUser(updatedUser);
      localStorage.setItem('returnbox_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateStoreLogo,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;