import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

function TestAPI() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API call to /api/v1/products');
        const response = await axios.get('/api/v1/products');
        console.log('API Response:', response.data);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>Testing API...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Test Results</h3>
      <p>Success: {data?.success ? 'Yes' : 'No'}</p>
      <p>Products Count: {data?.products?.length || 0}</p>
      <p>Total Products: {data?.productCount || 0}</p>
      {data?.products?.map((product, index) => (
        <div key={index} style={{ border: '1px solid #eee', padding: '10px', margin: '5px' }}>
          <h4>{product.name}</h4>
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default TestAPI;
