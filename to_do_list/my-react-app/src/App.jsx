import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/LoginPage/Login';
import Gorev from './components/GorevPage/Gorev';

const MainApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const location = useLocation();

  useEffect(() => {
    // Dinamik CSS sınıfı ayarlama
    if (location.pathname === '/login') {
      document.body.className = 'unauthenticated';
    } else if (location.pathname === '/gorev' && isAuthenticated) {
      document.body.className = 'authenticated';
    }
  }, [location, isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      /> {/* Login Sayfası */}
      <Route
        path="/gorev"
        element={isAuthenticated ? <Gorev onLogout={handleLogout} /> : <Navigate to="/login" />}
      /> {/* Görev Sayfası */}
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

export default App;
