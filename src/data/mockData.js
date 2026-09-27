export const STATS = [
  {
    id: 'ngos',
    title: 'Total NGOs Registered',
    value: '42,746+',
    change: '+12.4% this month',
    trend: 'up',
    bgColor: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-100 text-blue-900',
    iconColor: 'bg-blue-600 text-white',
    accentColor: 'text-blue-600',
    iconName: 'Building2',
  },
  {
    id: 'camps',
    title: 'Upcoming Camps & Events',
    value: '1,258+',
    change: '48 scheduled today',
    trend: 'active',
    bgColor: 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-100 text-emerald-900',
    iconColor: 'bg-emerald-600 text-white',
    accentColor: 'text-emerald-600',
    iconName: 'CalendarHeart',
  },
  {
    id: 'volunteers',
    title: 'Active Volunteers',
    value: '3,642+',
    change: 'Across 38 districts',
    trend: 'up',
    bgColor: 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-100 text-rose-900',
    iconColor: 'bg-rose-600 text-white',
    accentColor: 'text-rose-600',
    iconName: 'Users',
  },
  {
    id: 'donations',
    title: 'Donation Drives',
    value: '892+',
    change: '₹4.2Cr raised in 2026',
    trend: 'up',
    bgColor: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-100 text-purple-900',
    iconColor: 'bg-purple-600 text-white',
    accentColor: 'text-purple-600',
    iconName: 'HeartHandshake',
  }
];

export const CATEGORIES = [
  {
    id: 'medical',
    name: 'Medical & Health',
    count: '9,420 NGOs',
    icon: 'Stethoscope',
    bgLight: 'bg-red-50 text-red-700 border-red-200 hover:border-red-400',
    iconBg: 'bg-red-500 text-white',
    colorTag: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'education',
    name: 'Education',
    count: '8,150 NGOs',
    icon: 'GraduationCap',
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-600 text-white',
    colorTag: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'food',
    name: 'Food & Nutrition',
    count: '5,830 NGOs',
    icon: 'UtensilsCrossed',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400',
    iconBg: 'bg-amber-500 text-white',
    colorTag: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'environment',
    name: 'Environment',
    count: '4,210 NGOs',
    icon: 'Trees',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400',
    iconBg: 'bg-emerald-600 text-white',
    colorTag: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  {
    id: 'blood',
    name: 'Blood Donation',
    count: '3,940 NGOs',
    icon: 'Droplet',
    bgLight: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400',
    iconBg: 'bg-rose-600 text-white',
    colorTag: 'bg-rose-100 text-rose-700 border-rose-200'
  },
  {
    id: 'women_child',
    name: 'Women & Child',
    count: '6,110 NGOs',
    icon: 'HeartPulse',
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400',
    iconBg: 'bg-purple-600 text-white',
    colorTag: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    id: 'elderly',
    name: 'Elderly Care',
    count: '2,680 NGOs',
    icon: 'UserCheck',
    bgLight: 'bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-400',
    iconBg: 'bg-teal-600 text-white',
    colorTag: 'bg-teal-100 text-teal-700 border-teal-200'
  },
  {
    id: 'disability',
    name: 'Disability Support',
    count: '2,406 NGOs',
    icon: 'Accessibility',
    bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400',
    iconBg: 'bg-indigo-600 text-white',
    colorTag: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  }
];

export const DISTRICTS_DATA = [
  { rank: 1, name: 'Chennai', count: 2834, percentage: 85, color: '#1e40af' },
  { rank: 2, name: 'Coimbatore', count: 2156, percentage: 72, color: '#1d4ed8' },
  { rank: 3, name: 'Madurai', count: 1840, percentage: 65, color: '#2563eb' },
  { rank: 4, name: 'Tiruchirappalli', count: 1420, percentage: 55, color: '#3b82f6' },
  { rank: 5, name: 'Salem', count: 1110, percentage: 48, color: '#60a5fa' },
  { rank: 6, name: 'Tirunelveli', count: 980, percentage: 42, color: '#93c5fd' },
  { rank: 7, name: 'Thanjavur', count: 890, percentage: 38, color: '#bfdbfe' },
  { rank: 8, name: 'Kanchipuram', count: 820, percentage: 35, color: '#dbeafe' },
  { rank: 9, name: 'Vellore', count: 760, percentage: 32, color: '#e0e7ff' },
  { rank: 10, name: 'Erode', count: 710, percentage: 30, color: '#e0e7ff' },
  { rank: 11, name: 'Thoothukudi', count: 680, percentage: 28, color: '#e0e7ff' },
  { rank: 12, name: 'Dindigul', count: 650, percentage: 26, color: '#e0e7ff' },
  { rank: 13, name: 'Kanyakumari', count: 630, percentage: 25, color: '#e0e7ff' },
  { rank: 14, name: 'Cuddalore', count: 590, percentage: 23, color: '#e0e7ff' },
  { rank: 15, name: 'Tiruppur', count: 580, percentage: 22, color: '#e0e7ff' },
];

export const ALL_TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Viluppuram', 'Virudhunagar'
];

export const FEATURED_NGOS = [
  {
    id: 'ngo-1',
    name: 'Aram Seiya Virumbhu Foundation',
    category: 'Education',
    categoryTagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    district: 'Chennai',
    volunteers: '420+ Volunteers',
    established: '2014',
    rating: '4.9 ★ (128 reviews)',
    logoBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    logoInitials: 'ASV',
    description: 'Providing free after-school coaching, digital literacy, and educational supplies to underprivileged children across North Chennai.',
    description_ta: 'வட சென்னையில் உள்ள ஏழை குழந்தைகளுக்கு இலவச மாலை நேரக் கல்வி, டிஜிட்டல் அறிவு மற்றும் கல்வி உபகரணங்களை வழங்குதல்.',
    description_hi: 'उत्तरी चेन्नई में वंचित बच्चों को मुफ्त शाम की कोचिंग, डिजिटल साक्षरता और शैक्षिक सामग्री प्रदान करना।',
    verified: true,
    impact: '15,000+ students supported'
  },
  {
    id: 'ngo-2',
    name: 'Pasumai Tamilagam Green Trust',
    category: 'Environment',
    categoryTagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    district: 'Coimbatore',
    volunteers: '650+ Volunteers',
    established: '2017',
    rating: '4.8 ★ (94 reviews)',
    logoBg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    logoInitials: 'PTG',
    description: 'Dedicated to urban afforestation, Miyawaki forests, lake rejuvenation, and plastic-free drives around Western Ghats foothills.',
    description_ta: 'மேற்குத் தொடர்ச்சி மலை அடிவாரத்தில் நகர்ப்புற காடமைப்பு, மியாவாக்கி காடுகள், ஏரிகள் சீரமைப்பு மற்றும் பிளாஸ்டிக் இல்லா விழிப்புணர்வு இயக்கங்களில் செயல்படுகிறது.',
    description_hi: 'पश्चिमी घाट की तलहटी के आसपास शहरी वनीकरण, मियावाकी वन, झील पुनरुद्धार और प्लास्टिक-मुक्त अभियानों के लिए समर्पित।',
    verified: true,
    impact: '1.2 Lakh trees planted'
  },
  {
    id: 'ngo-3',
    name: 'Uyir Thuli Blood Donors Network',
    category: 'Blood Donation',
    categoryTagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    district: 'Madurai',
    volunteers: '890+ Donors',
    established: '2015',
    rating: '5.0 ★ (310 reviews)',
    logoBg: 'bg-gradient-to-br from-rose-500 to-red-700',
    logoInitials: 'UTB',
    description: '24/7 emergency blood & platelet matching network connecting hospitals and rare blood donors across Southern Tamil Nadu.',
    description_ta: 'தென் தமிழ்நாடு முழுவதும் மருத்துவமனைகளையும் அரிதான இரத்தக் கொடையாளர்களையும் இணைக்கும் 24/7 அவசர இரத்த தான சேவை நெட்வொர்க்.',
    description_hi: 'दक्षिण तमिलनाडु में अस्पतालों और दुर्लभ रक्तदाताओं को जोड़ने वाला 24/7 आपातकालीन रक्त और प्लेटलेट नेटवर्क।',
    verified: true,
    impact: '28,000+ lives saved'
  },
  {
    id: 'ngo-4',
    name: 'Agaram Elderly Care & Rehab',
    category: 'Elderly Care',
    categoryTagColor: 'bg-teal-100 text-teal-800 border-teal-200',
    district: 'Tiruchirappalli',
    volunteers: '210+ Caregivers',
    established: '2018',
    rating: '4.9 ★ (76 reviews)',
    logoBg: 'bg-gradient-to-br from-purple-500 to-indigo-700',
    logoInitials: 'AEC',
    description: 'Free healthcare checkups, nutrition packages, emotional wellness counselling, and shelter support for destitute senior citizens.',
    description_ta: 'ஆதரவற்ற முதியோருக்கு இலவச மருத்துவ பரிசோதனை, ஊட்டச்சத்து உணவுகள், மனநல ஆலோசனைகள் மற்றும் புகலிட ஆதரவு வழங்குதல்.',
    description_hi: 'बेसहारा वरिष्ठ नागरिकों के लिए मुफ्त स्वास्थ्य जांच, पोषण पैकेज, भावनात्मक कल्याण परामर्श और आश्रय सहायता।',
    verified: true,
    impact: '3,400+ elders supported'
  },
  {
    id: 'ngo-5',
    name: 'Annapoorna Meals Foundation',
    category: 'Food & Nutrition',
    categoryTagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    district: 'Salem',
    volunteers: '340+ Volunteers',
    established: '2016',
    rating: '4.9 ★ (150 reviews)',
    logoBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    logoInitials: 'AMF',
    description: 'Serving hot nutritious free meals daily to hospital attendees, daily wage laborers, and shelter homes in Salem & Erode.',
    description_ta: 'சேலம் மற்றும் ஈரோட்டில் உள்ள மருத்துவமனை நோயாளிகளின் உதவியாளர்கள், கூலித் தொழிலாளர்கள் மற்றும் காப்பகங்களுக்கு தினமும் இலவச சூடான உணவு வழங்குதல்.',
    description_hi: 'सेलम और ईरोड में अस्पताल परिचारकों, दिहाड़ी मजदूरों और आश्रय गृहों को रोजाना मुफ्त गर्म पौष्टिक भोजन परोसना।',
    verified: true,
    impact: '500,000+ meals served'
  },
  {
    id: 'ngo-6',
    name: 'Siragugal Women Empowerment Society',
    category: 'Women & Child',
    categoryTagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    district: 'Tirunelveli',
    volunteers: '280+ Mentors',
    established: '2019',
    rating: '4.8 ★ (82 reviews)',
    logoBg: 'bg-gradient-to-br from-pink-500 to-purple-600',
    logoInitials: 'SWE',
    description: 'Vocational tailoring skills, self-help group microloans, and legal aid for rural women across Tirunelveli and Tenkasi.',
    description_ta: 'திருநெல்வேலி மற்றும் தென்காசி கிராமப்புற பெண்களுக்கு தையல் பயிற்சி, சுயஉதவிக் குழு கடன்கள் மற்றும் சட்ட உதவிகளை வழங்குதல்.',
    description_hi: 'तिरुनेलवेली और तेनकासी में ग्रामीण महिलाओं के लिए व्यावसायिक सिलाई कौशल, स्वयं सहायता समूह ऋण और कानूनी सहायता।',
    verified: true,
    impact: '4,200+ women empowered'
  },
  {
    id: 'ngo-7',
    name: 'Nambikkai Disability Care Center',
    category: 'Disability Support',
    categoryTagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    district: 'Kanchipuram',
    volunteers: '190+ Therapists',
    established: '2013',
    rating: '4.9 ★ (115 reviews)',
    logoBg: 'bg-gradient-to-br from-indigo-500 to-blue-700',
    logoInitials: 'NDC',
    description: 'Custom prosthetic limbs, wheelchair distribution, and speech therapy for children with special needs in Northern TN.',
    description_ta: 'வட தமிழ்நாட்டின் மாற்றுத்திறனாளி குழந்தைகளுக்கு செயற்கை அவயங்கள், சக்கர நாற்காலிகள் விநியோகம் மற்றும் பேச்சுப் பயிற்சி அளித்தல்.',
    description_hi: 'उत्तरी तमिलनाडु में विशेष आवश्यकताओं वाले बच्चों के लिए कृत्रिम अंग, व्हीलचेयर वितरण और वाक् थेरेपी।',
    verified: true,
    impact: '1,800+ wheelchairs gifted'
  },
  {
    id: 'ngo-8',
    name: 'Kaveri Basin Eco Protection Trust',
    category: 'Environment',
    categoryTagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    district: 'Thanjavur',
    volunteers: '520+ Eco Volunteers',
    established: '2020',
    rating: '4.7 ★ (68 reviews)',
    logoBg: 'bg-gradient-to-br from-teal-500 to-emerald-700',
    logoInitials: 'KBE',
    description: 'Delta region riverbank afforestation, traditional organic farming workshops, and wetland bird sanctuary conservation.',
    description_ta: 'டெல்டா பகுதி ஆற்றங்கரை மரக்கன்றுகள் நடுதல், பாரம்பரிய இயற்கை விவசாயப் பயிற்சிகள் மற்றும் ஈரநிலப் பறவைகள் சரணாலயம் பாதுகாப்பு.',
    description_hi: 'डेल्टा क्षेत्र में नदी तट वनीकरण, पारंपरिक जैविक खेती कार्यशालाएं और आर्द्रभूमि पक्षी अभयारण्य संरक्षण।',
    verified: true,
    impact: '45 Lake bunds restored'
  },
  {
    id: 'ngo-9',
    name: 'Vallalar Emergency Ambulance Network',
    category: 'Medical & Health',
    categoryTagColor: 'bg-red-100 text-red-800 border-red-200',
    district: 'Vellore',
    volunteers: '310+ First Responders',
    established: '2015',
    rating: '5.0 ★ (210 reviews)',
    logoBg: 'bg-gradient-to-br from-rose-600 to-red-800',
    logoInitials: 'VEA',
    description: 'Free 24/7 emergency rural ambulance service connecting remote tribal hamlets in Jawadhu hills to CMC Vellore hospital.',
    description_ta: 'ஜவாது மலை கிராமப்புற மலைவாழ் மக்களை வேலூர் சிஎம்சி மருத்துவமனையுடன் இணைக்கும் இலவச 24/7 அவசர ஆம்புலன்ஸ் சேவை.',
    description_hi: 'जवादी पहाड़ियों के दूरस्थ जनजातीय गांवों को सीएमसी वेल्लोर अस्पताल से जोड़ने वाली मुफ्त 24/7 ग्रामीण एम्बुलेंस सेवा।',
    verified: true,
    impact: '12,500+ patient transports'
  },
  {
    id: 'ngo-10',
    name: 'Kamarajar Rural Education Trust',
    category: 'Education',
    categoryTagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    district: 'Virudhunagar',
    volunteers: '390+ Teachers',
    established: '2011',
    rating: '4.9 ★ (140 reviews)',
    logoBg: 'bg-gradient-to-br from-cyan-500 to-blue-700',
    logoInitials: 'KRE',
    description: 'Scholarships for rural students, computer labs in government schools, and NEET/JEE free coaching centers.',
    description_ta: 'கிராமப்புற மாணவர்களுக்கு கல்வி உதவித்தொகை, அரசுப் பள்ளிகளில் கணினி ஆய்வகங்கள் மற்றும் இலவச நீட்/ஜேஇஇ பயிற்சி மையங்கள்.',
    description_hi: 'ग्रामीण छात्रों के लिए छात्रवृत्ति, सरकारी स्कूलों में कंप्यूटर लैब और नीट/जेईई मुफ्त कोचिंग केंद्र।',
    verified: true,
    impact: '8,900+ scholars funded'
  }
];

export const UPCOMING_EVENTS = [
  {
    id: 'evt-1',
    category: 'Medical',
    categoryColor: 'bg-red-50 text-red-700 border-red-200',
    tagBadge: 'bg-red-500 text-white',
    title: 'Free Eye Checkup & Cataract Screening Camp',
    org: 'Aram Seiya Virumbhu Foundation',
    camp_type: 'government',
    date: 'Tomorrow, Sep 24 • 9:00 AM',
    time: '9:00 AM - 2:00 PM',
    location: 'T. Nagar Community Hall, Chennai',
    district: 'Chennai',
    spots: '120 spots left',
    spots_available: 120,
    description: 'State government supported comprehensive eye examination, free prescription glasses distribution, and cataract surgery registration.'
  },
  {
    id: 'evt-2',
    category: 'Blood',
    categoryColor: 'bg-pink-50 text-pink-700 border-pink-200',
    tagBadge: 'bg-pink-500 text-white',
    title: 'Mega Blood & Plasma Donation Drive 2026',
    org: 'Uyir Thuli Blood Network',
    camp_type: 'private',
    date: 'Sep 26 • 10:00 AM - 4:00 PM',
    time: '10:00 AM - 4:00 PM',
    location: 'VOC Park Grounds, Coimbatore',
    district: 'Coimbatore',
    spots: '45 spots left',
    spots_available: 45,
    description: 'Urgent voluntary blood donation drive organized in partnership with local hospital blood banks. Refreshments & certificate provided.'
  },
  {
    id: 'evt-3',
    category: 'Health',
    categoryColor: 'bg-purple-50 text-purple-700 border-purple-200',
    tagBadge: 'bg-purple-500 text-white',
    title: 'Geriatric Health & Mental Wellness Seminar',
    org: 'Agaram Care Trust',
    camp_type: 'government',
    date: 'Sep 28 • 9:30 AM',
    time: '9:30 AM - 1:00 PM',
    location: 'Srirangam Mandapam, Trichy',
    district: 'Tiruchirappalli',
    spots: '80 spots left',
    spots_available: 80,
    description: 'Specialized health checkup and wellness counselling drive for senior citizens above 60 years under District Social Welfare Board.'
  },
  {
    id: 'evt-4',
    category: 'Environment',
    categoryColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tagBadge: 'bg-emerald-500 text-white',
    title: '5,000 Seedball Plantation & Clean Drive',
    org: 'Pasumai Tamilagam',
    camp_type: 'private',
    date: 'Oct 01 • 7:00 AM',
    time: '7:00 AM - 11:00 AM',
    location: 'Mattuthavani Lake Bank, Madurai',
    district: 'Madurai',
    spots: '150 spots left',
    spots_available: 150,
    description: 'Community afforestation drive to plant 5,000 native seed balls along Mattuthavani lake bund.'
  },
  {
    id: 'evt-5',
    category: 'Medical',
    categoryColor: 'bg-red-50 text-red-700 border-red-200',
    tagBadge: 'bg-red-500 text-white',
    title: 'Paediatric Cardiac Screening & Free Surgery Camp',
    org: 'Vallalar Emergency Network',
    camp_type: 'government',
    date: 'Oct 05 • 8:30 AM',
    time: '8:30 AM - 3:00 PM',
    location: 'GH Campus, Vellore',
    district: 'Vellore',
    spots: '60 spots left',
    spots_available: 60,
    description: 'State government sponsored free congenital heart disease screening drive for infants and children under 15.'
  },
  {
    id: 'evt-6',
    category: 'Environment',
    categoryColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tagBadge: 'bg-emerald-500 text-white',
    title: 'Kaveri River Delta Cleanup & Plastic Collection',
    org: 'Kaveri Basin Eco Trust',
    camp_type: 'private',
    date: 'Oct 08 • 6:30 AM',
    time: '6:30 AM - 10:30 AM',
    location: 'Kallanai Dam Banks, Thanjavur',
    district: 'Thanjavur',
    spots: '200 spots left',
    spots_available: 200,
    description: 'Mass public cleanup drive along Kaveri river banks to eliminate single-use plastics before monsoon season.'
  }
];

export const VOLUNTEER_OPPORTUNITIES = [
  {
    id: 'vol-1',
    title: 'Weekend Digital Tutor for School Children',
    ngo: 'Aram Seiya Virumbhu Foundation',
    district: 'Chennai',
    commitment: '4 hrs/week (Saturdays)',
    category: 'Education',
    badge: 'Urgent Need',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
  },
  {
    id: 'vol-2',
    title: 'Emergency Blood Coordinator (Call Support)',
    ngo: 'Uyir Thuli Blood Donors Network',
    district: 'Madurai',
    commitment: 'Remote / Flexible',
    category: 'Blood Donation',
    badge: 'High Impact',
    badgeColor: 'bg-red-100 text-red-700 border-red-200',
    neededBloodGroups: ['O+', 'O-', 'AB-']
  },
  {
    id: 'vol-3',
    title: 'Miyawaki Urban Forest Planting Captain',
    ngo: 'Pasumai Tamilagam Green Trust',
    district: 'Coimbatore',
    commitment: 'Sunday Mornings',
    category: 'Environment',
    badge: 'Outdoor',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  {
    id: 'vol-4',
    title: 'Senior Citizen Companion & Care Helper',
    ngo: 'Agaram Elderly Care & Rehab',
    district: 'Tiruchirappalli',
    commitment: '3 hrs/week',
    category: 'Elderly Care',
    badge: 'Community',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200'
  }
];

export const USER_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'donation',
    title: 'Donated ₹1,000 to Aram Seiya Virumbhu Foundation',
    date: 'Sep 21, 2026',
    status: 'Completed',
    receipt: '#TN-2026-891',
    badge: '₹1,000',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'act-2',
    type: 'volunteer',
    title: 'Completed 4 hrs at Eye Checkup Camp (T. Nagar)',
    date: 'Sep 18, 2026',
    status: 'Verified',
    hours: '4 Hours',
    badge: '4 Hours Logged',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'act-3',
    type: 'event',
    title: 'Registered for Mega Blood Donation Drive 2026',
    date: 'Sep 15, 2026',
    status: 'Upcoming',
    location: 'VOC Park, Coimbatore',
    badge: 'Confirmed Seat',
    badgeColor: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'act-4',
    type: 'badge',
    title: 'Earned "Silver Community Contributor" Badge',
    date: 'Sep 10, 2026',
    status: 'Awarded',
    badge: 'Level 2 Badge',
    badgeColor: 'bg-amber-100 text-amber-800'
  }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, text: 'Urgent A+ Blood requirement at GH Madurai Hospital', time: '10m ago', unread: true, category: 'Blood Emergency' },
  { id: 2, text: 'Your volunteer application for Aram Eye Camp was approved!', time: '1h ago', unread: true, category: 'Volunteer' },
  { id: 3, text: 'New flood relief drive launched in Cuddalore district', time: '3h ago', unread: true, category: 'Disaster Relief' },
  { id: 4, text: 'Donation receipt #TN-2026-891 generated successfully (80G ready)', time: '1d ago', unread: false, category: 'Donation' },
  { id: 5, text: 'Pasumai Tamilagam added a new plantation camp in Coimbatore', time: '2d ago', unread: false, category: 'Environment' }
];

export const SERVICE_TYPES = [
  'Free Medical Camps',
  'Emergency Blood Supply',
  'Free Meal Distribution',
  'Ambulance & Transport',
  'Disaster Relief',
  'Child Education Aid',
  'Senior Citizen Care',
  'Disabled Assistance'
];

export const HELP_CENTERS = [
  {
    id: 'hc-1',
    name: 'Government General Hospital Emergency Aid Wing',
    district: 'Chennai',
    service: 'Free Medical Camps',
    phone: '+91 44 2530 5000 / 108',
    address: 'EVR Periyar Salai, Park Town, Chennai',
    hours: '24/7 Emergency Care',
    verified: true
  },
  {
    id: 'hc-2',
    name: 'Uyir Thuli Central Blood Bank & Emergency Hub',
    district: 'Madurai',
    service: 'Emergency Blood Supply',
    phone: '+91 94431 88990',
    address: 'KK Nagar Main Road, Madurai',
    hours: '24 Hours Instant Dispatch',
    verified: true
  },
  {
    id: 'hc-3',
    name: 'Annapoorna Free Community Kitchen & Meal Center',
    district: 'Salem',
    service: 'Free Meal Distribution',
    phone: '+91 427 244 1122',
    address: 'Four Roads Junction, Salem',
    hours: 'Breakfast 7AM • Lunch 12PM • Dinner 7PM',
    verified: true
  },
  {
    id: 'hc-4',
    name: 'Vallalar 24/7 Rural Emergency Ambulance Squad',
    district: 'Vellore',
    service: 'Ambulance & Transport',
    phone: '+91 98940 77112',
    address: 'CMC Hospital Corridor, Vellore',
    hours: 'Free Emergency Response',
    verified: true
  }
];

export const getCombinedSearchData = () => {
  const ngos = FEATURED_NGOS.map(ngo => ({
    id: ngo.id,
    type: 'ngo',
    title: ngo.name,
    subtext: `${ngo.category} • ${ngo.district}, Tamil Nadu`,
    district: ngo.district,
    category: ngo.category,
    description: ngo.description,
    raw: ngo
  }));

  const camps = UPCOMING_EVENTS.map(camp => ({
    id: camp.id,
    type: 'camp',
    title: camp.title,
    subtext: `${camp.category} Camp • ${camp.district} (${camp.date.split('•')[0]})`,
    district: camp.district,
    category: camp.category,
    description: `Organized by ${camp.org} at ${camp.location}`,
    raw: camp
  }));

  const categories = CATEGORIES.map(cat => ({
    id: cat.id,
    type: 'category',
    title: cat.name,
    subtext: `${cat.count} active non-profits`,
    district: 'All Districts',
    category: cat.name,
    description: `Explore all ${cat.name} non-profits and volunteer drives across Tamil Nadu`,
    raw: cat
  }));

  return [...ngos, ...camps, ...categories];
};
