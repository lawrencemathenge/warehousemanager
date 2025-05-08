import React, { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Home from '@components/Home';
import Products from '@components/Products';
import Transfers from '@components/Transfers';
import InventoryItems from '@components/InventoryItems';
import Navbar from '@components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div>
      {/* ✅ Add Navbar at the top */}
      <Navbar />

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/inventory" element={<InventoryItems />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
