export interface Baby {
  name: string;
  birthDate: string; // ISO date string
  gender: 'male' | 'female';
  avatarUrl?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  location?: string;
  notes?: string;
  status: 'completed' | 'upcoming' | 'future';
  ageLabel?: string;
  description?: string;
}

export interface GrowthRecord {
  id: string;
  date: string;
  weight: number; // kg
  height: number; // cm
}

export type JournalCategory = 'milestone' | 'health' | 'sleep' | 'feeding' | 'other';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  category: JournalCategory;
  imageUrl?: string;
  tags?: string[];
}

export interface AppData {
  baby: Baby;
  vaccinations: Vaccination[];
  growthRecords: GrowthRecord[];
  journalEntries: JournalEntry[];
}
