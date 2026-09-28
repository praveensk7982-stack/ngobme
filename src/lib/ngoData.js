import { supabase } from './supabaseClient';
import { FEATURED_NGOS } from '../data/mockData';

// Seed initial mock NGOs as approved
export const INITIAL_NGOS = FEATURED_NGOS.map((ngo, idx) => ({
  id: ngo.id || `ngo-initial-${idx + 1}`,
  name: ngo.name,
  reg_number: `TN/2026/${10000 + idx}`,
  category: ngo.category,
  district: ngo.district,
  description: ngo.description,
  contact_person: 'Official TN Volunteer Lead',
  mobile_number: '9444088776',
  email: `contact@${ngo.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`,
  logo: ngo.logoInitials || '',
  logoBg: ngo.logoBg || 'bg-gradient-to-br from-blue-500 to-indigo-600',
  categoryTagColor: ngo.categoryTagColor || 'bg-blue-100 text-blue-800 border-blue-200',
  volunteers: ngo.volunteers || '100+ Volunteers',
  established: ngo.established || '2020',
  rating: ngo.rating || '4.9 ★',
  website: ngo.website || '',
  status: 'approved',
  created_at: new Date(Date.now() - (idx * 86400000 * 30)).toISOString(),
  approved_at: new Date().toISOString(),
  submitted_by: 'system'
}));

// Fetch ALL NGOs from Supabase with LocalStorage fallback
export const getAllNGOs = async () => {
  try {
    const { data, error } = await supabase
      .from('ngos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const merged = [...data];
      INITIAL_NGOS.forEach(initNgo => {
        if (!merged.some(n => (n.reg_number && n.reg_number === initNgo.reg_number) || n.id === initNgo.id)) {
          merged.push(initNgo);
        }
      });
      localStorage.setItem('tn_ngo_registered_list', JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Supabase ngos fetch fallback:', err);
  }

  const stored = localStorage.getItem('tn_ngo_registered_list');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage parse notice:', e);
    }
  }

  localStorage.setItem('tn_ngo_registered_list', JSON.stringify(INITIAL_NGOS));
  return INITIAL_NGOS;
};

// Shared helper: Fetch ONLY approved NGOs (used by Directory, Search, Suggestions, Donate)
export const getApprovedNGOs = async () => {
  const all = await getAllNGOs();
  return all.filter(n => n.status === 'approved');
};

// Fetch pending NGOs for Admin Approvals Queue
export const getPendingNGOs = async () => {
  const all = await getAllNGOs();
  return all.filter(n => n.status === 'pending');
};

// Register a new NGO (always status: 'pending', prevents duplicate reg_number)
export const registerNewNGO = async (ngoData, user) => {
  const all = await getAllNGOs();

  // Prevent duplicate registration number (case-insensitive)
  const normReg = (ngoData.reg_number || '').trim().toLowerCase();
  const isDuplicate = all.some(n => (n.reg_number || '').trim().toLowerCase() === normReg);
  if (isDuplicate) {
    throw new Error(`An NGO with Registration Number "${ngoData.reg_number}" already exists.`);
  }

  const initials = ngoData.name
    ? ngoData.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()
    : 'NGO';

  const newNgo = {
    id: `ngo-${Date.now()}`,
    name: ngoData.name,
    reg_number: ngoData.reg_number,
    category: ngoData.category,
    district: ngoData.district,
    description: ngoData.description,
    contact_person: ngoData.contact_person,
    mobile_number: ngoData.mobile_number,
    email: ngoData.email,
    website: ngoData.website || '',
    logo: ngoData.logo || initials,
    logoBg: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600',
    categoryTagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    volunteers: '50+ Volunteers',
    established: new Date().getFullYear().toString(),
    rating: '5.0 ★ (New)',
    status: 'pending',
    created_at: new Date().toISOString(),
    submitted_by: user?.uid || user?.id || user?.email || 'user_anonymous'
  };

  const updated = [newNgo, ...all];
  localStorage.setItem('tn_ngo_registered_list', JSON.stringify(updated));

  try {
    await supabase.from('ngos').insert(newNgo);
  } catch (err) {
    console.warn('Supabase ngos insert notice:', err);
  }

  return newNgo;
};

// Update NGO status (Approve / Reject)
export const updateNGOStatus = async (id, status, reason = null) => {
  const all = await getAllNGOs();
  const updated = all.map(n => {
    if (n.id === id || n.reg_number === id) {
      return {
        ...n,
        status,
        ...(reason !== null && { rejection_reason: reason }),
        ...(status === 'approved' && { approved_at: new Date().toISOString() })
      };
    }
    return n;
  });

  localStorage.setItem('tn_ngo_registered_list', JSON.stringify(updated));

  try {
    const payload = {
      status,
      ...(reason !== null && { rejection_reason: reason }),
      ...(status === 'approved' && { approved_at: new Date().toISOString() })
    };
    await supabase.from('ngos').update(payload).or(`id.eq.${id},reg_number.eq.${id}`);
  } catch (err) {
    console.warn('Supabase ngos update notice:', err);
  }

  return updated;
};
