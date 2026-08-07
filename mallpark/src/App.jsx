import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useParkingStore } from './store/parkingStore';
import LandingPage from './pages/LandingPage';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import ParkingMap from './pages/ParkingMap';
import Reservations from './pages/Reservations';
import Analytics from './pages/Analytics';
import FeeEstimator from './pages/FeeEstimator';
import EVCharging from './pages/EVCharging';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

export default function App() {
  const { theme, simulateLiveUpdate } = useParkingStore();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      simulateLiveUpdate();
    }, 4000);
    return () => clearInterval(interval);
  }, [simulateLiveUpdate]);

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#27272a' : '#fff',
            color: theme === 'dark' ? '#f4f4f5' : '#18181b',
            border: '1px solid #facc15',
            borderRadius: '10px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<ParkingMap />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/fee-estimator" element={<FeeEstimator />} />
          <Route path="/ev-charging" element={<EVCharging />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
