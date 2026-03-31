import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import HealthPage from './pages/HealthPage';
import VaccinationForm from './pages/VaccinationForm';
import GrowthPage from './pages/GrowthPage';
import GrowthForm from './pages/GrowthForm';
import JournalPage from './pages/JournalPage';
import JournalForm from './pages/JournalForm';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/health/add" element={<VaccinationForm />} />
            <Route path="/health/edit/:id" element={<VaccinationForm />} />
            <Route path="/growth" element={<GrowthPage />} />
            <Route path="/growth/add" element={<GrowthForm />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/add" element={<JournalForm />} />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </AppProvider>
  );
}
