import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import HistoricalData from '@/pages/HistoricalData';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 sm:pt-24">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/historical" element={<HistoricalData />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
