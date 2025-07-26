// components/UserDashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, filterProductsByUser } from '../Redux/Slices/ProductSlice';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from '@mui/material';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { userProducts, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      dispatch(filterProductsByUser(user.email));
    }
  }, [dispatch]);

  return (
    <Container sx={{ mt: 15, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Your Posted Products
      </Typography>

      {status === 'loading' ? (
        <CircularProgress />
      ) : userProducts.length === 0 ? (
        <Typography>No products posted yet.</Typography>
      ) : (
        <Paper sx={{ overflowX: 'auto' , mt: 5 , mb: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.category || 'N/A'}</TableCell>
                  <TableCell
                    style={{
                      color: product.status === 'approved' ? 'green' : 'orange',
                      fontWeight: 600,
                    }}
                  >
                    {product.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default UserDashboard;
