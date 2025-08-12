import React, { useState } from 'react';

const VerifyOtpModal = ({ email, onSuccess, onClose }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || 'Invalid OTP');
        setLoading(false);
        return;
      }

      // ✅ OTP verified
      onSuccess(); // Notify parent to proceed with registration
      onClose();   // Close modal
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('Server error during OTP verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 border rounded mb-4 text-lg"
        />
        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-600 hover:underline block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpModal;
