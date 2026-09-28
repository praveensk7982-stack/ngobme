import { supabase } from './supabaseClient';

export const INITIAL_OPENINGS = [
  {
    id: 'op-1',
    title: 'Weekend Teaching Volunteer',
    ngo_id: 'ngo-1',
    ngo_name: 'Aram Seiya Virumbhu Foundation',
    district: 'Chennai',
    category_tag: 'High Impact',
    time_commitment: '4 hrs/week (Saturdays)',
    blood_groups_needed: '',
    description: 'Provide free after-school coaching, digital literacy, and educational mentoring to underprivileged children in North Chennai.',
    status: 'active',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString()
  },
  {
    id: 'op-2',
    title: 'Emergency Blood Drive Coordinator',
    ngo_id: 'ngo-3',
    ngo_name: 'Uyir Thuli Blood Donors Network',
    district: 'Madurai',
    category_tag: 'Urgent Need',
    time_commitment: 'On-call / Emergency',
    blood_groups_needed: 'O+, O-, AB-',
    description: 'Coordinate emergency blood donor matching and logistics for trauma surgeries at GH Madurai.',
    status: 'active',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString()
  },
  {
    id: 'op-3',
    title: 'Miyawaki Forest Tree Plantation',
    ngo_id: 'ngo-2',
    ngo_name: 'Pasumai Tamilagam Green Trust',
    district: 'Coimbatore',
    category_tag: 'Outdoor',
    time_commitment: 'Sunday Mornings',
    blood_groups_needed: '',
    description: 'Join urban afforestation drives, Miyawaki forest sapling planting, and plastic cleanup along Western Ghats foothills.',
    status: 'active',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString()
  },
  {
    id: 'op-4',
    title: 'Elderly Care Assistant & Scribe',
    ngo_id: 'ngo-4',
    ngo_name: 'Agaram Elderly Care & Rehab',
    district: 'Tiruchirappalli',
    category_tag: 'Community',
    time_commitment: '3 hrs/week',
    blood_groups_needed: '',
    description: 'Assist destitute senior citizens with healthcare checkups, reading/writing assistance, and emotional wellness companionship.',
    status: 'active',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString()
  }
];

// Fetch openings from Supabase with LocalStorage fallback
export const getVolunteerOpenings = async () => {
  try {
    const { data, error } = await supabase
      .from('volunteer_openings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      localStorage.setItem('tn_ngo_volunteer_openings', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Supabase volunteer_openings fetch fallback:', err);
  }

  // Fallback to local storage or initial seed
  const stored = localStorage.getItem('tn_ngo_volunteer_openings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage parse notice:', e);
    }
  }

  localStorage.setItem('tn_ngo_volunteer_openings', JSON.stringify(INITIAL_OPENINGS));
  return INITIAL_OPENINGS;
};

// Save opening to Supabase & LocalStorage
export const saveVolunteerOpening = async (opening) => {
  const current = await getVolunteerOpenings();
  const updated = [opening, ...current.filter(o => o.id !== opening.id)];
  localStorage.setItem('tn_ngo_volunteer_openings', JSON.stringify(updated));

  try {
    await supabase.from('volunteer_openings').upsert(opening);
  } catch (err) {
    console.warn('Supabase volunteer_openings upsert fallback:', err);
  }

  return updated;
};

// Update opening status (e.g. approve, reject, close)
export const updateVolunteerOpeningStatus = async (id, status, reason = null) => {
  const current = await getVolunteerOpenings();
  const updated = current.map(o => {
    if (o.id === id) {
      return {
        ...o,
        status,
        rejection_reason: reason !== null ? reason : o.rejection_reason,
        approved_at: status === 'active' ? new Date().toISOString() : o.approved_at
      };
    }
    return o;
  });

  localStorage.setItem('tn_ngo_volunteer_openings', JSON.stringify(updated));

  try {
    const payload = { 
      status, 
      ...(reason !== null && { rejection_reason: reason }),
      ...(status === 'active' && { approved_at: new Date().toISOString() })
    };
    await supabase.from('volunteer_openings').update(payload).eq('id', id);
  } catch (err) {
    console.warn('Supabase volunteer_openings update fallback:', err);
  }

  return updated;
};

// Delete opening
export const deleteVolunteerOpening = async (id) => {
  const current = await getVolunteerOpenings();
  const updated = current.filter(o => o.id !== id);
  localStorage.setItem('tn_ngo_volunteer_openings', JSON.stringify(updated));

  try {
    await supabase.from('volunteer_openings').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase volunteer_openings delete fallback:', err);
  }

  return updated;
};

// Send In-App Notification to NGO
export const sendInAppNotification = async (notif) => {
  try {
    const existing = JSON.parse(localStorage.getItem('tn_ngo_notifications') || '[]');
    const updated = [notif, ...existing];
    localStorage.setItem('tn_ngo_notifications', JSON.stringify(updated));

    await supabase.from('notifications').insert(notif);
  } catch (err) {
    console.warn('In-app notification insert notice:', err);
  }
};
