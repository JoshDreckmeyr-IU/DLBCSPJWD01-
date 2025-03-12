
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
    emailConfirmationSent: boolean;
  }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session fetch
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
          toast.error('Authentication service unavailable');
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (error) {
        console.error('Unexpected error during session fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        
        // Handle email not confirmed error specifically
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please confirm your email before signing in. Check your inbox for a confirmation link.');
        } else {
          toast.error(`Sign in failed: ${error.message}`);
        }
        
        return { error, success: false };
      }

      navigate('/');
      return { error: null, success: true };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return { error: error as Error, success: false };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth',
        }
      });

      if (error) {
        console.error('Error signing up:', error);
        
        // Handle rate limit errors
        if (error.message.includes('rate limit')) {
          toast.error('Too many attempts. Please try again in a few minutes.');
        } else {
          toast.error(`Sign up failed: ${error.message}`);
        }
        
        return { error, success: false, emailConfirmationSent: false };
      }

      // Check if email confirmation was sent
      const emailConfirmationSent = data?.user?.identities?.length === 0 || 
                                   (data?.user?.identities && data.user.identities.length > 0 && 
                                    !data.user.identities[0].identity_data?.email_verified);
      
      if (emailConfirmationSent) {
        toast.success('Registration successful! Please check your email for the confirmation link before signing in.');
      } else {
        toast.success('Registration successful! You can now sign in.');
      }

      return { 
        error: null, 
        success: true, 
        emailConfirmationSent 
      };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      return { 
        error: error as Error, 
        success: false, 
        emailConfirmationSent: false 
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
