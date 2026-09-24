import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Initialize auth state from Supabase & localStorage on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          const stored = localStorage.getItem('tn_ngo_auth');
          const parsed = stored ? JSON.parse(stored) : null;
          setRole(parsed?.role || 'user');
        } else {
          // Check for mock admin session in localStorage
          const stored = localStorage.getItem('tn_ngo_auth');
          const parsed = stored ? JSON.parse(stored) : null;
          if (parsed?.role === 'admin') {
            setUser(parsed.user);
            setRole('admin');
          } else {
            setUser(null);
            setRole(null);
          }
        }
      } catch (err) {
        console.error('Failed to initialize Supabase session:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    // Subscribe to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setRole((prev) => (prev === 'admin' ? 'admin' : 'user'));
      } else {
        setRole((prev) => {
          if (prev === 'admin') return 'admin';
          setUser(null);
          return null;
        });
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Send Email OTP via Supabase Auth
  const sendOtp = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
    if (error) throw error;
  };

  // Verify Email OTP token via Supabase Auth
  const verifyOtp = async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
    if (error) throw error;

    if (data?.session?.user) {
      setUser(data.session.user);
      setRole('user');
      localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: data.session.user, role: 'user' }));
    }
    return data;
  };

  // Mock Admin Login for Admin Portal
  const loginAdmin = (email, name = 'State Secretarial Admin') => {
    const adminData = {
      email: email || 'admin@ngo-tn.gov.in',
      name: name,
      district: 'State Secretariat, Chennai',
      badge: 'State Admin Lead'
    };
    setUser(adminData);
    setRole('admin');
    localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: adminData, role: 'admin' }));
  };

  // Logout from Supabase & Local Session
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
    setUser(null);
    setRole(null);
    localStorage.removeItem('tn_ngo_auth');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, sendOtp, verifyOtp, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
