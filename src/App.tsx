import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Home from '@/pages/Home';
import AlertsPage from '@/pages/AlertsPage';
import WeatherPage from '@/pages/WeatherPage';
import SensorsPage from '@/pages/SensorsPage';
import SatellitePage from '@/pages/SatellitePage';
import AnalysisPage from '@/pages/AnalysisPage';
import MapPage from '@/pages/MapPage';
import CropSuggestionPage from '@/pages/CropSuggestionPage';
import VoiceAssistantPage from '@/pages/VoiceAssistantPage';
import HistoricalData from '@/pages/HistoricalData';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 sm:pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/sensors" element={<SensorsPage />} />
            <Route path="/satellite" element={<SatellitePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/crops" element={<CropSuggestionPage />} />
            <Route path="/voice" element={<VoiceAssistantPage />} />
            <Route path="/historical" element={<HistoricalData />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
