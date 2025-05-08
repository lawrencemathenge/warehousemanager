import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../utils/useAuthFetch';

const InventoryItems = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await authFetch('http://127.0.0.1:5000/api/inventory');

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch inventory items');
        }

        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchItems();
  }, [authFetch, navigate]);

  return (
    <div>
      <h2>Inventory Items</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} — Qty: {item.quantity} — Location: {item.location || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryItems;
