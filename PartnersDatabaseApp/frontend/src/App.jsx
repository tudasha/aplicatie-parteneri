import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import CompanyDetail from './pages/CompanyDetail';
import TutorialOverlay from './components/TutorialOverlay';

// Configure axios base URL
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
if (API_URL && !API_URL.startsWith('http')) {
  API_URL = `https://${API_URL}`;
}
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Inner component so we have access to useNavigate
function AppInner() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  // Ref so tutorial can call setShowMetrics on Dashboard without prop drilling
  const dashboardActionsRef = useRef({});

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.authenticated) {
        const u = { username: response.data.username, role: response.data.role };
        setUser(u);
        // Auto-show tutorial for first-time visitors (only when logged in)
        const seen = localStorage.getItem('arttu_tutorial_seen');
        if (!seen) {
          setShowTutorial(true);
          localStorage.setItem('arttu_tutorial_seen', '1');
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clay-brand"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={checkAuth} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard
                  user={user}
                  onLogout={checkAuth}
                  onOpenTutorial={() => setShowTutorial(true)}
                  dashboardActionsRef={dashboardActionsRef}
                />
              : <Navigate to="/login" />
          }
        />
        <Route path="/company/:id" element={user ? <CompanyDetail user={user} /> : <Navigate to="/login" />} />
      </Routes>

      {/* Tutorial lives at App level so it persists across navigations */}
      {showTutorial && user && (
        <TutorialOverlay
          onClose={() => setShowTutorial(false)}
          navigate={navigate}
          dashboardActionsRef={dashboardActionsRef}
        />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
