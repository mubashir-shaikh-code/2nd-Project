// src/Redux/Slices/OrderSlice.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/orders';

// ✅ Helper to always attach token from localStorage
const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ✅ Place an order
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData) => {
      const res = await axios.post(`${BASE_URL}/place`, orderData, authHeaders());
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userOrders']);
    },
  });
};

// ✅ Get orders for logged-in user
export const useUserOrders = () =>
  useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/user`, authHeaders());
      return res.data;
    },
    enabled: !!localStorage.getItem('token'),
  });

// ✅ Request cancellation
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      const res = await axios.patch(
        `${BASE_URL}/cancel/${orderId}`,
        {},
        authHeaders()
      );
      return { orderId, message: res.data.message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userOrders']);
      queryClient.invalidateQueries(['adminOrders']);
    },
  });
};

// ✅ Admin: Get all orders
export const useAdminOrders = () =>
  useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/admin`, authHeaders());
      return res.data;
    },
    enabled: !!localStorage.getItem('token'),
  });

// ✅ Admin: Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }) => {
      const res = await axios.put(
        `${BASE_URL}/admin/${orderId}`,
        { status },
        authHeaders()
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      queryClient.invalidateQueries(['userOrders']);
    },
  });
};
