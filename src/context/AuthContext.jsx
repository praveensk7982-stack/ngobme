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

        const emailPrefix = firebaseUser.email 
          ? firebaseUser.email.split('@')[0].charAt(0).toUpperCase() + firebaseUser.email.split('@')[0].slice(1)
          : 'User';

        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('name, role, phone, district')
            .eq('email', firebaseUser.email)
            .maybeSingle();

          if (profile) {
            if (profile.name && profile.name !== 'Volunteer Member') {
              profileName = profile.name;
            }
            if (profile.role === 'admin') profileRole = 'admin';
            if (profile.phone) profilePhone = profile.phone;
            if (profile.district) profileDistrict = profile.district;
          } else {
            // Auto-create missing user_profiles row in Supabase
            const fallbackName = (firebaseUser.displayName && firebaseUser.displayName !== 'Volunteer Member') 
              ? firebaseUser.displayName 
              : emailPrefix;

            await supabase.from('user_profiles').upsert({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: fallbackName,
              phone: profilePhone,
              district: profileDistrict,
              created_at: new Date().toISOString()
            }, { onConflict: 'email' });
            
            profileName = fallbackName;
          }
        } catch (err) {
          console.warn('AuthContext Supabase profile lookup error:', err);
        }

        // Final name fallback without generic 'Volunteer Member'
        if (!profileName || profileName === 'Volunteer Member') {
          profileName = (firebaseUser.displayName && firebaseUser.displayName !== 'Volunteer Member')
            ? firebaseUser.displayName
            : emailPrefix;
        }

        const badgeText = profileRole === 'admin'
          ? 'State Secretariat Admin'
          : (parsed?.user?.badge || 'Verified Volunteer');

        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: profileName,
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