import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'admin' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state listener — login/logout/page-refresh handle
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const stored = localStorage.getItem('tn_ngo_auth');
        const parsed = stored ? JSON.parse(stored) : null;

        let profileName = firebaseUser.displayName || parsed?.user?.name;
        let profileRole = parsed?.role === 'admin' ? 'admin' : 'user';
        let profilePhone = parsed?.user?.phone || '';
        let profileDistrict = parsed?.user?.district || 'Chennai';

        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('name, role, phone, district')
            .eq('email', firebaseUser.email)
            .maybeSingle();

          if (profile) {
            if (profile.name) profileName = profile.name;
            if (profile.role === 'admin') profileRole = 'admin';
            if (profile.phone) profilePhone = profile.phone;
            if (profile.district) profileDistrict = profile.district;
          }
        } catch (err) {
          console.warn('AuthContext Supabase profile lookup fallback:', err);
        }

        // Clean up fallback if name is empty or looks like username email split
        if (!profileName || profileName === firebaseUser.email?.split('@')[0]) {
          if (parsed?.user?.name && parsed.user.name !== firebaseUser.email?.split('@')[0]) {
            profileName = parsed.user.name;
          } else if (firebaseUser.displayName) {
            profileName = firebaseUser.displayName;
          }
        }

        const badgeText = profileRole === 'admin'
          ? 'State Secretariat Admin'
          : (parsed?.user?.badge || 'Verified Volunteer');

        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: profileName || 'Volunteer Member',
          phone: profilePhone,
          district: profileDistrict,
          badge: badgeText
        };

        setUser(userObj);
        setRole(profileRole);
        localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: userObj, role: profileRole }));
      } else {
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