export type ResourceCategory = 'legal_aid' | 'crisis_shelter' | 'psychosocial_ngo' | 'medical_protection';

export interface SupportResource {
  id: string;
  name: string;
  category: ResourceCategory;
  district: string;
  state: string;
  distanceKm: number;
  address: string;
  landmark?: string;
  phone: string;
  emergencyHelpline?: string;
  operatingHours: string;
  languages: string[];
  servicesOffered: string[];
  statutoryMandate: string;
  contactPerson?: string;
  verificationStatus: 'dlsa_empanelled' | 'govt_verified' | 'ngos_network' | 'tele_manas_hub';
  is24x7: boolean;
  notes?: string;
}

export const DIRECTORY_RESOURCES: SupportResource[] = [
  // --- Morbi, Gujarat ---
  {
    id: 'res-morbi-dlsa',
    name: 'District Legal Services Authority (DLSA) - Morbi',
    category: 'legal_aid',
    district: 'Morbi',
    state: 'Gujarat',
    distanceKm: 4.2,
    address: 'District & Sessions Court Complex, Lalbagh Road, Morbi - 363641',
    landmark: 'Opposite Old Collectorate Office',
    phone: '02822-240188',
    emergencyHelpline: '15100 (NALSA 24/7)',
    operatingHours: '10:00 AM - 05:30 PM (Mon-Sat)',
    languages: ['Gujarati', 'Hindi', 'English'],
    servicesOffered: [
      'Free PoA Special Court defense & victim counsel',
      'Immediate victim compensation application filing (Rule 12)',
      'Witness protection liaison with SP Morbi',
      'Bail opposition for SC/ST atrocity cases'
    ],
    statutoryMandate: 'Legal Services Authorities Act 1987 & SC/ST (PoA) Amendment Rules 2016',
    contactPerson: 'Secretary, DLSA / Legal Aid Defense Counsel (LADC)',
    verificationStatus: 'dlsa_empanelled',
    is24x7: false,
    notes: 'Prioritized counter for atrocity complainants. No income bar for SC/ST citizens.'
  },
  {
    id: 'res-morbi-oscc',
    name: 'Sakhi One-Stop Crisis Center (OSCC) - Morbi',
    category: 'crisis_shelter',
    district: 'Morbi',
    state: 'Gujarat',
    distanceKm: 2.8,
    address: 'General Civil Hospital Campus, Near Circuit House, Morbi - 363642',
    landmark: 'Inside Civil Hospital Premises',
    phone: '02822-223400',
    emergencyHelpline: '181 (Abhayam Gujarat) / 112',
    operatingHours: '24 Hours / 7 Days',
    languages: ['Gujarati', 'Hindi'],
    servicesOffered: [
      'Emergency temporary shelter (up to 5 days)',
      'Medico-legal examination & MLC documentation',
      'Immediate psychosocial first aid & trauma support',
      'Direct video-link recording of statement'
    ],
    statutoryMandate: 'Ministry of WCD Scheme for One Stop Centres',
    contactPerson: 'Centre Administrator (24/7 on-call)',
    verificationStatus: 'govt_verified',
    is24x7: true,
    notes: 'Safe secure perimeter with female protection staff and round-the-clock nurse.'
  },
  {
    id: 'res-morbi-ngo-navsarjan',
    name: 'Navsarjan Trust - Saurashtra Community Atrocity Support Desk',
    category: 'psychosocial_ngo',
    district: 'Morbi',
    state: 'Gujarat',
    distanceKm: 11.5,
    address: 'Plot 44, Shakambhari Society, Rajkot Highway, Morbi Rural - 363641',
    landmark: 'Near Khodiyar Mandir Circle',
    phone: '+91-94268-81204',
    emergencyHelpline: '+91-98250-14566',
    operatingHours: '09:00 AM - 08:00 PM (Emergency mobile team 24/7)',
    languages: ['Gujarati', 'Hindi'],
    servicesOffered: [
      'Atrocity survivor emergency relief kit & groceries',
      'Independent paralegal fact-finding & FIR tracking',
      'Safe community-based sanctuary in case of village boycott',
      'Trauma counseling & social reintegration'
    ],
    statutoryMandate: 'Grassroots Dalit Human Rights Collective (Est. 1989)',
    contactPerson: 'Saurashtra Field Coordinator',
    verificationStatus: 'ngos_network',
    is24x7: true,
    notes: 'Active experience supporting victims of boycott, agricultural land denial, and caste slurs.'
  },
  {
    id: 'res-morbi-telemanas',
    name: 'Tele-MANAS Gujarat Regional Hub - Rajkot/Morbi Division',
    category: 'psychosocial_ngo',
    district: 'Morbi',
    state: 'Gujarat',
    distanceKm: 34.0,
    address: 'Hospital for Mental Health, Jamnagar Road, Rajkot (Serving Morbi)',
    phone: '14416 (Toll-Free 24/7)',
    emergencyHelpline: '1800-891-4416',
    operatingHours: '24 Hours / 7 Days',
    languages: ['Gujarati', 'Hindi', 'English'],
    servicesOffered: [
      'Psychiatric crisis de-escalation',
      'Clinical suicide risk management',
      'Trauma-informed cognitive coping sessions',
      'Direct linkage to District Mental Health Program (DMHP)'
    ],
    statutoryMandate: 'National Tele Mental Health Programme of India',
    contactPerson: 'Senior Clinical Psychologist On-Duty',
    verificationStatus: 'tele_manas_hub',
    is24x7: true,
    notes: 'Direct 3-way line integration available via NHAA 14566 console.'
  },
  {
    id: 'res-morbi-civil-hosp',
    name: 'District Civil Hospital Medico-Legal Emergency Cell',
    category: 'medical_protection',
    district: 'Morbi',
    state: 'Gujarat',
    distanceKm: 3.1,
    address: 'Liliya Road, Civil Hospital Road, Morbi - 363641',
    phone: '02822-220050',
    emergencyHelpline: '108 (Ambulance)',
    operatingHours: '24 Hours / 7 Days',
    languages: ['Gujarati', 'Hindi'],
    servicesOffered: [
      'Priority injury certification & forensic medical assessment',
      'Free medications & inpatient trauma recovery ward',
      'Police surgeon medical board documentation for PoA FIR',
      'Emergency ambulance dispatch to rural talukas'
    ],
    statutoryMandate: 'Gujarat Health Department & Statutory Medico-Legal Guidelines',
    contactPerson: 'Resident Medical Officer (RMO)',
    verificationStatus: 'govt_verified',
    is24x7: true
  },

  // --- Surendranagar, Gujarat ---
  {
    id: 'res-snagar-dlsa',
    name: 'District Legal Services Authority (DLSA) - Surendranagar',
    category: 'legal_aid',
    district: 'Surendranagar',
    state: 'Gujarat',
    distanceKm: 5.8,
    address: 'New Court Complex, Dudhrej Road, Surendranagar - 363002',
    landmark: 'Near Dudhrej Canal',
    phone: '02752-282110',
    emergencyHelpline: '15100',
    operatingHours: '10:30 AM - 05:30 PM (Mon-Sat)',
    languages: ['Gujarati', 'Hindi'],
    servicesOffered: [
      'Empanelled Special Prosecutor assistance',
      'Protection against agricultural land eviction under Sec 3(1)(g)',
      'Immediate interim relief sanctioning under Rule 12(4)',
      'Lok Adalat and pre-litigation grievance redressal'
    ],
    statutoryMandate: 'NALSA & Gujarat State Legal Services Authority',
    contactPerson: 'Secretary, DLSA Surendranagar',
    verificationStatus: 'dlsa_empanelled',
    is24x7: false
  },
  {
    id: 'res-snagar-oscc',
    name: 'Sakhi One Stop Centre - Surendranagar',
    category: 'crisis_shelter',
    district: 'Surendranagar',
    state: 'Gujarat',
    distanceKm: 4.1,
    address: 'Opp. Sub-Jail, Near Mahila Police Station, Surendranagar - 363001',
    phone: '02752-225181',
    emergencyHelpline: '181 / 112',
    operatingHours: '24 Hours / 7 Days',
    languages: ['Gujarati', 'Hindi'],
    servicesOffered: [
      '24/7 Safe crisis residence for women & child survivors',
      'Legal counseling by paralegal volunteer',
      'Psychological trauma debriefing',
      'Police emergency intervention coordination'
    ],
    statutoryMandate: 'Central Govt Sakhi Scheme',
    contactPerson: 'Centre Manager',
    verificationStatus: 'govt_verified',
    is24x7: true
  },
  {
    id: 'res-snagar-dalit-adhikar',
    name: 'Dalit Adhikar Manch - Saurashtra Paralegal Helpdesk',
    category: 'psychosocial_ngo',
    district: 'Surendranagar',
    state: 'Gujarat',
    distanceKm: 8.6,
    address: 'Ambedkar Bhawan, Mill Road, Wadhwan, Surendranagar - 363030',
    phone: '+91-98790-23411',
    operatingHours: '09:00 AM - 07:00 PM',
    languages: ['Gujarati', 'Hindi'],
    servicesOffered: [
      'Community protection watch in boycotted hamlets',
      'Ration and emergency supply coordination',
      'Accompanying victims to DySP/SP office for statement',
      'Legal literacy workshops'
    ],
    statutoryMandate: 'Registered Society & Human Rights Advocacy',
    contactPerson: 'District Convener',
    verificationStatus: 'ngos_network',
    is24x7: false
  },

  // --- Sonbhadra, Uttar Pradesh ---
  {
    id: 'res-sonbhadra-dlsa',
    name: 'District Legal Services Authority (DLSA) - Sonbhadra',
    category: 'legal_aid',
    district: 'Sonbhadra',
    state: 'Uttar Pradesh',
    distanceKm: 6.5,
    address: 'District Court Complex, Robertsganj, Sonbhadra - 231216',
    landmark: 'Near Collectorate Compound',
    phone: '05444-222390',
    emergencyHelpline: '15100',
    operatingHours: '10:00 AM - 05:00 PM (Mon-Sat)',
    languages: ['Hindi', 'Bhojpuri'],
    servicesOffered: [
      'Free legal defense for Scheduled Tribe / Forest Rights claimants',
      'Section 3(1)(g) land grab victim restitution petitions',
      'Victim compensation processing under UP State Scheme',
      'Special Court legal aid clinic'
    ],
    statutoryMandate: 'UPSLSA / NALSA Mandate',
    contactPerson: 'Secretary / Civil Judge (Senior Division)',
    verificationStatus: 'dlsa_empanelled',
    is24x7: false
  },
  {
    id: 'res-sonbhadra-oscc',
    name: 'Sakhi One Stop Centre - Robertsganj, Sonbhadra',
    category: 'crisis_shelter',
    district: 'Sonbhadra',
    state: 'Uttar Pradesh',
    distanceKm: 3.9,
    address: 'District Combined Hospital Campus, Robertsganj, Sonbhadra - 231216',
    phone: '05444-224181',
    emergencyHelpline: '1090 (Women Power Line) / 112',
    operatingHours: '24 Hours / 7 Days',
    languages: ['Hindi', 'Bhojpuri'],
    servicesOffered: [
      'Emergency temporary accommodation for female victims of violence',
      'Immediate medical evaluation & treatment',
      'Free legal counseling',
      'Trauma counseling'
    ],
    statutoryMandate: 'Ministry of WCD Scheme',
    contactPerson: 'Centre In-Charge',
    verificationStatus: 'govt_verified',
    is24x7: true
  },
  {
    id: 'res-sonbhadra-vanvasi',
    name: 'Adivasi Vanvasi Kalyan Trust & Human Rights Desk',
    category: 'psychosocial_ngo',
    district: 'Sonbhadra',
    state: 'Uttar Pradesh',
    distanceKm: 18.2,
    address: 'Chopan Road, Near Sone River Bridge, Sonbhadra - 231205',
    phone: '+91-94503-41982',
    emergencyHelpline: '+91-94152-88765',
    operatingHours: '08:30 AM - 07:30 PM (Emergency responders on-call)',
    languages: ['Hindi', 'Gondi', 'Bhojpuri'],
    servicesOffered: [
      'Tribal community grievance escalation',
      'Immediate crisis shelter in forested talukas',
      'Food relief & medical transport support',
      'Support against forest mafia & retaliatory threats'
    ],
    statutoryMandate: 'Tribal Rights Foundation',
    contactPerson: 'Tribal Rights Director',
    verificationStatus: 'ngos_network',
    is24x7: true
  },
  {
    id: 'res-up-telemanas',
    name: 'Tele-MANAS Uttar Pradesh Apex Hub (KGMU Lucknow)',
    category: 'psychosocial_ngo',
    district: 'Sonbhadra',
    state: 'Uttar Pradesh',
    distanceKm: 85.0,
    address: 'Department of Psychiatry, King George Medical University, Lucknow',
    phone: '14416 (Toll-Free)',
    emergencyHelpline: '1800-891-4416',
    operatingHours: '24 Hours / 7 Days',
    languages: ['Hindi', 'Bhojpuri', 'Awadhi', 'English'],
    servicesOffered: [
      '24/7 tele-psychiatric crisis triage',
      'Suicide prevention counseling',
      'Referral to district hospital psychiatric unit'
    ],
    statutoryMandate: 'National Mental Health Mission',
    contactPerson: 'Tele-MANAS Regional Lead',
    verificationStatus: 'tele_manas_hub',
    is24x7: true
  },

  // --- Jalna, Maharashtra ---
  {
    id: 'res-jalna-dlsa',
    name: 'District Legal Services Authority (DLSA) - Jalna',
    category: 'legal_aid',
    district: 'Jalna',
    state: 'Maharashtra',
    distanceKm: 4.8,
    address: 'District & Sessions Court, Devalgaon Raja Road, Jalna - 431203',
    phone: '02482-224410',
    emergencyHelpline: '15100',
    operatingHours: '10:00 AM - 05:30 PM (Mon-Sat)',
    languages: ['Marathi', 'Hindi', 'English'],
    servicesOffered: [
      'PoA Special Court legal defense',
      'Victim compensation under Manodhairya Scheme',
      'Witness protection measures'
    ],
    statutoryMandate: 'Maharashtra State Legal Services Authority',
    contactPerson: 'Secretary, DLSA Jalna',
    verificationStatus: 'dlsa_empanelled',
    is24x7: false
  },
  {
    id: 'res-jalna-oscc',
    name: 'Sakhi One Stop Centre - Jalna',
    category: 'crisis_shelter',
    district: 'Jalna',
    state: 'Maharashtra',
    distanceKm: 3.5,
    address: 'District Civil Hospital Campus, Jalna - 431203',
    phone: '02482-231181',
    emergencyHelpline: '112',
    operatingHours: '24 Hours / 7 Days',
    languages: ['Marathi', 'Hindi'],
    servicesOffered: [
      'Emergency overnight shelter & nutrition',
      'Legal & medical assistance',
      'Police liaison officer on site'
    ],
    statutoryMandate: 'Central Govt OSC Initiative',
    contactPerson: 'Centre Coordinator',
    verificationStatus: 'govt_verified',
    is24x7: true
  },

  // --- Kachchh, Gujarat ---
  {
    id: 'res-kachchh-dlsa',
    name: 'District Legal Services Authority (DLSA) - Kachchh (Bhuj)',
    category: 'legal_aid',
    district: 'Kachchh',
    state: 'Gujarat',
    distanceKm: 7.0,
    address: 'Court Building, Mundra Road, Bhuj, Kachchh - 370001',
    phone: '02832-250100',
    emergencyHelpline: '15100',
    operatingHours: '10:00 AM - 05:30 PM',
    languages: ['Gujarati', 'Kutchi', 'Hindi'],
    servicesOffered: [
      'Special Court legal representation',
      'Compensation filing for rural & pastoral communities'
    ],
    statutoryMandate: 'GSLSA / NALSA',
    contactPerson: 'Secretary, DLSA Bhuj',
    verificationStatus: 'dlsa_empanelled',
    is24x7: false
  },

  // --- Ahmednagar, Maharashtra ---
  {
    id: 'res-anagar-dlsa',
    name: 'District Legal Services Authority (DLSA) - Ahmednagar',
    category: 'legal_aid',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    distanceKm: 5.2,
    address: 'District Court, Station Road, Ahmednagar - 414001',
    phone: '0241-2423310',
    emergencyHelpline: '15100',
    operatingHours: '10:00 AM - 05:30 PM',
    languages: ['Marathi', 'Hindi', 'English'],
    servicesOffered: [
      'Free legal aid clinic for caste atrocity survivors',
      'Manodhairya scheme filing'
    ],
    statutoryMandate: 'MSLSA',
    contactPerson: 'Secretary DLSA',
    verificationStatus: 'dlsa_empanelled',
    is24x7: false
  },

  // --- Sitapur, Uttar Pradesh ---
  {
    id: 'res-sitapur-dlsa',
    name: 'District Legal Services Authority (DLSA) - Sitapur',
    category: 'legal_aid',
    district: 'Sitapur',
    state: 'Uttar Pradesh',
    distanceKm: 4.0,
    address: 'District Court Compound, Sitapur - 261001',
    phone: '05862-243220',
    emergencyHelpline: '15100',
    operatingHours: '10:00 AM - 05:00 PM',
    languages: ['Hindi', 'Awadhi'],
    servicesOffered: [
      'Legal defense counsel & victim compensation processing'
    ],
    statutoryMandate: 'UPSLSA',
    contactPerson: 'Secretary DLSA Sitapur',
    verificationStatus: 'dlsa_empanelled',
    is24x7: false
  },

  // --- National & State Apex Safeguards (Always Available Fallback) ---
  {
    id: 'res-apex-nalsa',
    name: 'National Legal Services Authority (NALSA) Central Atrocity Front Desk',
    category: 'legal_aid',
    district: 'Central / All Districts',
    state: 'National',
    distanceKm: 0,
    address: 'B-Block, Additional Building Complex, Supreme Court of India, New Delhi - 110001',
    phone: '011-23382778',
    emergencyHelpline: '15100 (National Legal Helpline 24/7)',
    operatingHours: '24 Hours / 7 Days (Telephony)',
    languages: ['Hindi', 'English', 'Gujarati', 'Marathi', 'Tamil', 'Bengali'],
    servicesOffered: [
      'Immediate assignment of Free Legal Aid Defense Counsel in any district',
      'High Court & Supreme Court Special Leave Petition (SLP) intervention',
      'Mandatory monitoring of PoA Special Courts across all states'
    ],
    statutoryMandate: 'Statutory Body under Legal Services Authorities Act, 1987',
    contactPerson: 'Member Secretary, NALSA',
    verificationStatus: 'dlsa_empanelled',
    is24x7: true,
    notes: 'Universal legal safety net when local district legal aid fails or faces conflict of interest.'
  },
  {
    id: 'res-apex-state-nodal-adgp',
    name: 'State Nodal Officer / ADGP Human Rights & PoA Protection Cell',
    category: 'medical_protection',
    district: 'Statewide Apex',
    state: 'State Apex',
    distanceKm: 0,
    address: 'State Police Headquarters / Human Rights Division (Gandhinagar / Lucknow / Mumbai)',
    phone: '079-23254344 (Gujarat) / 0522-2209520 (UP)',
    emergencyHelpline: '112 (National Emergency Number)',
    operatingHours: '24 Hours / 7 Days',
    languages: ['Hindi', 'Gujarati', 'Marathi', 'English'],
    servicesOffered: [
      'Retaliation-Aware Restricted Routing escalation receiver',
      'Direct dispatch of State Protection Squad when local police are conflicted',
      'Mandatory weekly compliance review with Home Secretary'
    ],
    statutoryMandate: 'Section 15A SC/ST (PoA) Act & Rule 9 Appointment of Nodal Officer',
    contactPerson: 'Additional Director General of Police (ADGP, Human Rights)',
    verificationStatus: 'govt_verified',
    is24x7: true,
    notes: 'Invoked automatically when Restricted Routing is triggered for high-threat cases.'
  }
];

export const CATEGORY_METADATA: Record<ResourceCategory, { label: string; badgeColor: string; icon: string }> = {
  legal_aid: {
    label: 'Legal Aid & DLSA',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: 'Scale',
  },
  crisis_shelter: {
    label: 'Crisis Shelters & OSCC',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: 'Home',
  },
  psychosocial_ngo: {
    label: 'Psychosocial & NGOs',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    icon: 'HeartHandshake',
  },
  medical_protection: {
    label: 'Medical & Protection',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: 'Shield',
  },
};
