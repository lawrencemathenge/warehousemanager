// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Inventory Dashboard</div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/dashboard/products" style={styles.link}>Products</Link>
<Link to="/dashboard/transfers" style={styles.link}>Transfers</Link>
<Link to="/dashboard/inventory" style={styles.link}>Inventory</Link>

      </div>

      <div style={styles.user}>
        <span style={styles.username}>Hi, {username}</span>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#282c34',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '20px',
  },
  links: {
    display: 'flex',
    gap: '15px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  username: {
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;
