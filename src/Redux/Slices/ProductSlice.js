import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL = 'http://localhost:5000/api/products';

// ✅ Fetch all approved products
export const useAllProducts = () =>
  useQuery({
    queryKey: ['allProducts'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

// ✅ Fetch products of the logged-in user
export const useUserProducts = (userEmail) =>
  useQuery({
    queryKey: ['userProducts', userEmail],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/user?userEmail=${encodeURIComponent(userEmail)}`);
      if (!res.ok) throw new Error('Failed to fetch user products');
      return res.json();
    },
    enabled: !!userEmail,
  });

// ✅ Post a new product
export const usePostProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, token }) => {
      const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Product post failed');
      return data.product;
    },
    onSuccess: (_, { payload }) => {
      queryClient.invalidateQueries(['userProducts', payload.userEmail]);
    },
  });
};

// ✅ Update an existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Product update failed');
      return data;
    },
    onSuccess: (_, { updatedData }) => {
      queryClient.invalidateQueries(['userProducts', updatedData.userEmail]);
    },
  });
};
