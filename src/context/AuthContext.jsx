import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tn_ngo_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role) {
          setUser(parsed.user || null);
          setRole(parsed.role);
        }
      }
    } catch (err) {
      console.error('Failed to parse auth session from localStorage', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = (email, name = 'Dharshini Raj', district = 'Chennai') => {
    const userData = {
      email: email || 'dharshini@ngo-tn.org',
      name: name,
      district: district,
      phone: '+91 94440 88776',
      badge: 'Verified Volunteer Lead'
    };
    setUser(userData);
    setRole('user');
    localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: userData, role: 'user' }));
  };

  const loginAdmin = (email, name = 'System Administrator') => {
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

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('tn_ngo_auth');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginUser, loginAdmin, logout }}>
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
