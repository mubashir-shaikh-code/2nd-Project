// src/components/VerifyOtpModal.jsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const VerifyOtpModal = ({ email, onSuccess, onClose }) => {
  const [otp, setOtp] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp,
      });
      return data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        alert(data.message || 'Invalid OTP');
        return;
      }
      onSuccess(); // Notify parent to proceed
      onClose();   // Close modal
    },
    onError: (error) => {
      console.error('OTP verification error:', error);
      alert('Server error during OTP verification');
    },
  });

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      alert('Please enter the OTP');
      return;
    }
    mutate();
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
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {isPending ? 'Verifying...' : 'Verify OTP'}
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
