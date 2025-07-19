import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);

  useEffect(() => {
    fetchPending();
    fetchApproved();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products/pending');
      const data = await res.json();
      setPendingProducts(data);
    } catch (error) {
      console.error('Failed to fetch pending products', error);
    }
  };

  const fetchApproved = async () => {
    try {
      const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products/approved');
      const data = await res.json();
      setApprovedProducts(data);
    } catch (error) {
      console.error('Failed to fetch approved products', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`https://2nd-project-backend-production.up.railway.app/api/products/approve/${id}`, {
        method: 'PUT',
      });
      fetchPending();
      fetchApproved();
    } catch (error) {
      console.error('Failed to approve product', error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl text-center font-bold mb-6">Admin Panel</h2>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Pending Products</h3>
        {pendingProducts.length === 0 ? (
          <p className="text-gray-500">No pending products.</p>
        ) : (
          <ul className="space-y-2">
            {pendingProducts.map((product) => (
              <li
                key={product._id}
                className="flex justify-between items-center bg-white p-4 shadow rounded"
              >
                <span>{product.description}</span>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleApprove(product._id)}
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Approved Products</h3>
        {approvedProducts.length === 0 ? (
          <p className="text-gray-500">No approved products yet.</p>
        ) : (
          <ul className="space-y-2">
            {approvedProducts.map((product) => (
              <li
                key={product._id}
                className="bg-white p-4 shadow rounded"
              >
                {product.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
