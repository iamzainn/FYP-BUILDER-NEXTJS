'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  syncUserWithDatabase: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null,
  syncUserWithDatabase: async () => {},
  login: async () => {},
  logout: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from your database
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we have a stored session
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setUser(null);
        return;
      }

      // Try to get user from your database
      const response = await fetch('/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If API fails, still use stored user as fallback
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('user');
          console.log(e);
          
          setUser(null);
        }
        return;
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: unknown) {
      console.error('Error fetching user data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching user data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync user with your database
  const syncUserWithDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) return;

      const response = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user data');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err: unknown) {
      console.error('Error syncing user data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while syncing user data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom login function (without Clerk)
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Replace with your actual login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Initialize user data from localStorage on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        syncUserWithDatabase,
        login,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 