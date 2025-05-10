
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Define the User type
export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  authProvider: 'azuread' | 'local';
};

// Define the AuthContextType
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  loginWithAzure: () => Promise<void>;
  logout: () => void;
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get environment
const isProduction = process.env.NODE_ENV === 'production';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      try {
        // For demo purposes, we'll just parse the token
        // In a real app, you'd validate this with your backend
        const userData = JSON.parse(atob(token.split('.')[1]));
        
        if (userData) {
          setUser({
            id: userData.sub || userData.id,
            name: userData.name,
            email: userData.email,
            profilePicture: userData.picture,
            authProvider: userData.authProvider || 'local'
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error parsing token:', err);
        localStorage.removeItem('authToken');
      }
    };
    
    checkAuth();
  }, []);

  // Local login function
  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual API call in production
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // For demo purposes
      if (email === 'user@example.com' && password === 'password') {
        // Create a mock token with user info
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: email,
          authProvider: 'local',
          exp: Math.floor(Date.now() / 1000) + (rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60)
        };
        
        const mockToken = `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(mockUser))}.SIGNATURE`;
        
        localStorage.setItem('authToken', mockToken);
        
        setUser({
          id: '1',
          name: 'Demo User',
          email: email,
          authProvider: 'local'
        });
        
        setIsAuthenticated(true);
        navigate('/dashboard');
        toast({
          title: "Login successful",
          description: "Welcome to the dashboard!",
        });
      } else {
        setError('Invalid email or password');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Azure AD login function
  const loginWithAzure = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would redirect to Azure AD here
      // window.location.href = 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?...';
      
      // For demo purposes, we'll simulate a successful Azure AD login
      setTimeout(() => {
        const mockAzureUser = {
          id: 'azure123',
          name: 'Azure User',
          email: 'azure.user@company.com',
          profilePicture: 'https://via.placeholder.com/150',
          authProvider: 'azuread',
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        };
        
        const mockToken = `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(mockAzureUser))}.SIGNATURE`;
        
        localStorage.setItem('authToken', mockToken);
        
        setUser({
          id: 'azure123',
          name: 'Azure User',
          email: 'azure.user@company.com',
          profilePicture: 'https://via.placeholder.com/150',
          authProvider: 'azuread'
        });
        
        setIsAuthenticated(true);
        navigate('/dashboard');
        toast({
          title: "Microsoft login successful",
          description: "Welcome to the dashboard!",
        });
      }, 1500);
    } catch (err) {
      console.error('Azure login error:', err);
      setError('Microsoft login failed. Please try again.');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during Microsoft login",
      });
    } finally {
      // In the real implementation, this would be set after redirect back
      // For the demo, we set it after the timeout
      // setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      isAuthenticated,
      login,
      loginWithAzure,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
