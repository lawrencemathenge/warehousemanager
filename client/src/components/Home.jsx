import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>Welcome to the Warehouse Management System</h1>
      <p>Manage your products, inventory, and transfers easily.</p>

      <div style={{ marginTop: '30px' }}>
        <Link to="/login">
          <button style={{ margin: '10px', padding: '10px 20px' }}>Login</button>
        </Link>
        <Link to="/register">
          <button style={{ margin: '10px', padding: '10px 20px' }}>Register</button>
        </Link>
      </div>

      <img
        src="/images/warehouse.jpg"
        alt="Warehouse"
        style={{ maxWidth: '100%', height: 'auto', marginTop: '40px', borderRadius: '10px' }}
      />
    </div>
  );
};

export default Home;
