import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'admin' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state listener — login/logout/page-refresh எல்லாம் இது handle பண்ணும்
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const stored = localStorage.getItem('tn_ngo_auth');
        const parsed = stored ? JSON.parse(stored) : null;

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || parsed?.user?.name || firebaseUser.email?.split('@')[0] || 'Volunteer Member',
          district: parsed?.user?.district || 'Chennai',
          badge: parsed?.user?.badge || 'Verified Volunteer'
        });
        setRole(parsed?.role === 'admin' ? 'admin' : 'user');
      } else {
        // Firebase-ல session இல்லன்னா, localStorage-ல demo/mock session இருக்கான்னு பாருங்க
        const stored = localStorage.getItem('tn_ngo_auth');
        const parsed = stored ? JSON.parse(stored) : null;

        if (parsed?.user) {
          setUser(parsed.user);
          setRole(parsed.role || 'user');
        } else {
          setUser(null);
          setRole(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout Handler
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut warning:', err);
    }
    localStorage.removeItem('tn_ngo_auth');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, setUser, setRole }}>
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