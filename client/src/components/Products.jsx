import React, { useEffect, useState } from 'react';
import { useAuth } from '@Auth/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(true);

  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await authFetch('http://127.0.0.1:5000/api/products');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData?.message || 'Failed to fetch products'}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setError('Received data is not an array.');
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        setError(err.message);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authFetch]);

  useEffect(() => {
    let filtered = [...products];

    if (selectedBranch !== 'All') {
      filtered = filtered.filter(p => p.branch === selectedBranch);
    }
    if (selectedProduct !== 'All') {
      filtered = filtered.filter(p => p.name === selectedProduct);
    }

    setFilteredProducts(filtered);
  }, [selectedBranch, selectedProduct, products]);

  const uniqueBranches = ['All', ...new Set(products.map(p => p.branch).filter(Boolean))];
  const uniqueProductNames = ['All', ...new Set(products.map(p => p.name).filter(Boolean))];

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2>Product List</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          Filter by Branch:
          <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}>
            {uniqueBranches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </label>

        <label>
          Filter by Product:
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
            {uniqueProductNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>

      {filteredProducts.length === 0 && !error && <p>No products match the selected filters.</p>}
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> — 
            Warehouse Qty: {product.warehouse_qty}, 
            Branch Qty: {product.branch_qty}, 
            Warehouse: {product.warehouse || 'N/A'}, 
            Branch: {product.branch || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
