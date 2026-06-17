import React from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Admin from './pages/Admin';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Modal from "react-modal";
import { NotificationProvider } from './context/NotificationContext';
import NotificationBanner from './components/NotificationBanner';

Modal.setAppElement('#root');

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
      <NotificationBanner />
    </NotificationProvider>
  );
}

export default App;
