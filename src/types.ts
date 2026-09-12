export type ThemePreset = 
  | 'indigo-royal'
  | 'emerald-modern'
  | 'ocean-cyan'
  | 'crimson-prestige'
  | 'amber-sunset'
  | 'purple-galaxy';

export type FontPairing = 'modern' | 'clean' | 'editorial' | 'tech';

export interface SchoolConfig {
  name: string;
  shortName: string;
  tagline: string;
  subTagline: string;
  accreditation: string;
  establishedYear: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  themePreset: ThemePreset;
  fontPairing: FontPairing;
  ppdbStatus: {
    isOpen: boolean;
    gelombang: string;
    tahunAjaran: string;
    deadline: string;
    kuotaTersisa: number;
    diskonEarlyBird: string;
  };
  stats: {
    kelulusan: string;
    ptnFavorit: string;
    medaliPrestasi: string;
    ekskulCount: string;
    pengajarS2S3: string;
    alumniTersebar: string;
  };
  principal: {
    name: string;
    title: string;
    photo: string;
    quote: string;
    message: string[];
    speechVideoUrl?: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Prestasi' | 'Kegiatan' | 'Pengumuman';
  date: string;
  excerpt: string;
  image: string;
  readTime: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  studentName: string;
  competition: string;
  category: 'Internasional' | 'Nasional' | 'Sains' | 'Seni & Olahraga';
  year: string;
  badge: string;
  image: string;
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: 'Sains & Riset' | 'Seni & Budaya' | 'Olahraga' | 'Kepemimpinan';
  description: string;
  coach: string;
  schedule: string;
  image: string;
  highlight: string;
}

export interface FacilityItem {
  id: string;
  title: string;
  category: 'Laboratorium' | 'Akademik' | 'Olahraga' | 'Seni & Rekreasi';
  description: string;
  image: string;
  features: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  cohortYear: string;
  currentAffiliation: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'PPDB' | 'Kurikulum' | 'Biaya' | 'Fasilitas';
}

export type PageView = 'home' | 'layanan' | 'portal' | 'elibrary';

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: 'Kurikulum' | 'Internasional' | 'Riset' | 'Sastra' | 'Sains' | 'Audio';
  cover: string;
  year: number;
  pages: number;
  rating: number;
  isbn: string;
  availableDigital: boolean;
  availablePhysical: boolean;
  description: string;
  sampleChapterText: string;
}

