import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../utils/useAuthFetch';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ product_id: '', branch_id: '', quantity: '' });

  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');

  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transferRes, productRes, branchRes] = await Promise.all([
          authFetch('http://127.0.0.1:5000/api/transfers'),
          authFetch('http://127.0.0.1:5000/api/products'),
          authFetch('http://127.0.0.1:5000/api/branches'),
        ]);

        if (!transferRes.ok || !productRes.ok || !branchRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [transferData, productData, branchData] = await Promise.all([
          transferRes.json(),
          productRes.json(),
          branchRes.json(),
        ]);

        setTransfers(transferData);
        setProducts(productData);
        setBranches(branchData);
      } catch (err) {
        setError(err.message);
        setTimeout(() => navigate('/login'), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authFetch, navigate]);

  const handleCreateChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const productId = parseInt(form.product_id);
    const branchId = parseInt(form.branch_id);
    const quantity = parseInt(form.quantity);

    if (isNaN(productId) || isNaN(branchId) || isNaN(quantity) || quantity <= 0) {
      setError('Please fill all fields with valid values.');
      return;
    }

    try {
      const res = await authFetch('http://127.0.0.1:5000/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          branch_id: branchId,
          quantity: quantity, // this matches Flask's expected input
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || 'Failed to create transfer');
      }

      const newTransfer = await res.json();
      setTransfers((prev) => [...prev, newTransfer]);
      setForm({ product_id: '', branch_id: '', quantity: '' });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`http://127.0.0.1:5000/api/transfers/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete transfer');

      setTransfers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTransfers = transfers.filter((t) => {
    return (
      (selectedProduct === 'All' || t.product === selectedProduct) &&
      (selectedBranch === 'All' || t.branch === selectedBranch)
    );
  });

  const uniqueProductNames = ['All', ...new Set(transfers.map((t) => t.product))];
  const uniqueBranchNames = ['All', ...new Set(transfers.map((t) => t.branch))];

  if (loading) return <p>Loading transfers...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Transfer Requests</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          Filter by Product:
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            {uniqueProductNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter by Branch:
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            {uniqueBranchNames.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form onSubmit={handleCreateSubmit} style={{ marginBottom: '1rem' }}>
        <h4>Create Transfer</h4>
        <select name="product_id" value={form.product_id} onChange={handleCreateChange} required>
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select name="branch_id" value={form.branch_id} onChange={handleCreateChange} required>
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleCreateChange}
          placeholder="Qty"
          required
          min="1"
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>Submit</button>
      </form>

      <ul>
        {filteredTransfers.map((t) => (
          <li key={t.id}>
            <strong>{t.product}</strong> — {t.qty} units to <strong>{t.branch}</strong>
            <button onClick={() => handleDelete(t.id)} style={{ marginLeft: '1rem', color: 'red' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transfers;
