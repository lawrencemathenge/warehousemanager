import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
<Route path="/products" element={<Navigate to="/dashboard/products" replace />} />
import Home from '@components/Home';
import Login from '@Auth/Login';
import Register from '@Auth/Register';
import Dashboard from '@components/Dashboard';
import { AuthProvider } from '@Auth/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
