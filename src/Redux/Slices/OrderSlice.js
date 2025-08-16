import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/orders';

// Axios helper
const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

//    Place an order
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderData, token }) => {
      const res = await axios.post(`${BASE_URL}/place`, orderData, authHeaders(token));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userOrders']);
    },
  });
};

//    Get orders for logged-in user
export const useUserOrders = (token) =>
  useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/user`, authHeaders(token));
      return res.data;
    },
    enabled: !!token,
  });

//    Request cancellation
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, token }) => {
      const res = await axios.patch(`${BASE_URL}/cancel/${orderId}`, {}, authHeaders(token));
      return { orderId, message: res.data.message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userOrders']);
      queryClient.invalidateQueries(['adminOrders']);
    },
  });
};

//    Admin: Get all orders
export const useAdminOrders = (token) =>
  useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/admin`, authHeaders(token));
      return res.data;
    },
    enabled: !!token,
  });

//    Admin: Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status, token }) => {
      const res = await axios.put(`${BASE_URL}/admin/${orderId}`, { status }, authHeaders(token));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      queryClient.invalidateQueries(['userOrders']);
    },
  });
};
