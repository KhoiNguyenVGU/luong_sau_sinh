import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppData, Vaccination, GrowthRecord, JournalEntry } from '../types';
import { defaultData } from '../data/defaultData';

interface AppContextType {
  data: AppData;
  addVaccination: (v: Omit<Vaccination, 'id'>) => void;
  updateVaccination: (v: Vaccination) => void;
  deleteVaccination: (id: string) => void;
  addGrowthRecord: (r: Omit<GrowthRecord, 'id'>) => void;
  addJournalEntry: (e: Omit<JournalEntry, 'id'>) => void;
  deleteJournalEntry: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'baby-journey-data';

function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultData;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  const addVaccination = (v: Omit<Vaccination, 'id'>) => {
    setData(prev => ({
      ...prev,
      vaccinations: [...prev.vaccinations, { ...v, id: genId() }],
    }));
  };

  const updateVaccination = (v: Vaccination) => {
    setData(prev => ({
      ...prev,
      vaccinations: prev.vaccinations.map(item => item.id === v.id ? v : item),
    }));
  };

  const deleteVaccination = (id: string) => {
    setData(prev => ({
      ...prev,
      vaccinations: prev.vaccinations.filter(item => item.id !== id),
    }));
  };

  const addGrowthRecord = (r: Omit<GrowthRecord, 'id'>) => {
    setData(prev => ({
      ...prev,
      growthRecords: [...prev.growthRecords, { ...r, id: genId() }],
    }));
  };

  const addJournalEntry = (e: Omit<JournalEntry, 'id'>) => {
    setData(prev => ({
      ...prev,
      journalEntries: [{ ...e, id: genId() }, ...prev.journalEntries],
    }));
  };

  const deleteJournalEntry = (id: string) => {
    setData(prev => ({
      ...prev,
      journalEntries: prev.journalEntries.filter(item => item.id !== id),
    }));
  };

  return (
    <AppContext.Provider value={{
      data, addVaccination, updateVaccination, deleteVaccination,
      addGrowthRecord, addJournalEntry, deleteJournalEntry,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppProvider');
  return ctx;
}
