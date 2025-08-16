import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  ListItem,
  ListItemText,
  ListItemButton,
  TableContainer,
  Paper,
  Button,
} from '@mui/material';
import axios from 'axios';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';

const drawerWidth = 240;

//    Inline API functions
const fetchUserProducts = async () => {
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get('http://localhost:5000/api/products/user', config);
  return res.data;
};

const fetchUserOrders = async () => {
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get('http://localhost:5000/api/orders/user', config);
  return res.data;
};

const requestOrderCancellationAPI = async (orderId) => {
  const token = localStorage.getItem('token');
  await axios.patch(
    `http://localhost:5000/api/orders/cancel/${orderId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const deleteProductAPI = async (productId) => {
  const token = localStorage.getItem('token');
  await axios.delete(`http://localhost:5000/api/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const UserPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const [selectedTab, setSelectedTab] = useState('pending');

  //    React Query v5-compliant queries
  const {
    data: products = [],
    isError: productError,
  } = useQuery({
    queryKey: ['userProducts'],
    queryFn: fetchUserProducts,
    enabled: !!user,
  });
  
  const {
    data: orders = [],
    isError: orderError,
  } = useQuery({
    queryKey: ['userOrders'],
    queryFn: fetchUserOrders,
    enabled: !!user,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: requestOrderCancellationAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const logout = () => {
    dispatch(logoutAction());
    localStorage.clear();
    navigate('/');
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    deleteProductMutation.mutate(productId);
  };

  const handleCancelRequest = (orderId) => {
    cancelOrderMutation.mutate(orderId);
  };

  const renderProductTable = (products, isPending) => {
    if (!products.length) {
      return <Typography>No products found.</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              {isPending && <TableCell><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.status}</TableCell>
                {isPending && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(product._id)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderOrdersTable = () => {
    const visibleOrders = orders.filter(order => !order.cancelApproved);

    if (!visibleOrders.length) {
      return <Typography>No orders found.</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Cancel</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.product?.description}</TableCell>
                <TableCell>${order.price}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {order.cancellationRequested ? (
                    <Typography color="warning.main">Requested</Typography>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancelRequest(order._id)}
                    >
                      Request Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderContent = () => {
    if (productError || orderError) {
      return <Typography color="error">Failed to load data.</Typography>;
    }

    const pending = products.filter(p => p.status === 'pending');
    const approved = products.filter(p => p.status === 'approved');

    if (selectedTab === 'pending') {
      return renderProductTable(pending, true);
    } else if (selectedTab === 'approved') {
      return renderProductTable(approved, false);
    } else if (selectedTab === 'orders') {
      return renderOrdersTable();
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backgroundColor: 'black',
            color: 'white',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography variant="h5" sx={{ p: 2, color: 'white' }}>
          My Product Panel
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedTab === 'pending'}
              onClick={() => setSelectedTab('pending')}
            >
              <PendingActionsIcon sx={{ mr: 1, color: 'white' }} />
              <ListItemText primary="Pending Products" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={selectedTab === 'approved'}
              onClick={() => setSelectedTab('approved')}
            >
              <CheckCircleIcon sx={{ mr: 1, color: 'white' }} />
              <ListItemText primary="Approved Products" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={selectedTab === 'orders'}
              onClick={() => setSelectedTab('orders')}
            >
              <LocalShippingIcon sx={{ mr: 1, color: 'white' }} />
              <ListItemText primary="My Orders" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
                            <LogoutIcon sx={{ mr: 1, color: 'white' }} />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 10 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {selectedTab === 'pending'
            ? 'My Pending Products'
            : selectedTab === 'approved'
            ? 'My Approved Products'
            : 'My Orders'}
        </Typography>

        {renderContent()}
      </Box>
    </Box>
  );
};

export default UserPanel;
