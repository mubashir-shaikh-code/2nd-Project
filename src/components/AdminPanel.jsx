import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  Typography,
  Button,
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
  Select,
  MenuItem,
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';

const drawerWidth = 240;

// ✅ Fetch APIs
const fetchApprovedProducts = async () => {
  const res = await axios.get('http://localhost:5000/api/products');
  return Array.isArray(res.data) ? res.data : res.data.products || [];
};

const fetchPendingProducts = async () => {
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get('http://localhost:5000/api/products/pending', config);
  return Array.isArray(res.data) ? res.data : res.data.products || [];
};

const fetchOrders = async () => {
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get('http://localhost:5000/api/orders/admin', config);
  // Backend returns array directly, not res.data.orders
  return Array.isArray(res.data) ? res.data : [];
};

// ✅ Mutations
const approveProductAPI = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.patch(
    `http://localhost:5000/api/products/approve/${id}`,
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

const rejectProductAPI = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.patch(
    `http://localhost:5000/api/products/reject/${id}`,
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

const updateOrderStatusAPI = async ({ orderId, status }) => {
  const token = localStorage.getItem('token');
  await axios.put(
    `http://localhost:5000/api/orders/admin/${orderId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [statusMap, setStatusMap] = useState({});

  // ✅ Queries
  const { data: approvedProducts = [] } = useQuery({
    queryKey: ['approvedProducts'],
    queryFn: fetchApprovedProducts,
  });

  const { data: pendingProducts = [] } = useQuery({
    queryKey: ['pendingProducts'],
    queryFn: fetchPendingProducts,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchOrders,
  });

  // ✅ Mutations
  const approveProduct = useMutation({
    mutationFn: approveProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['approvedProducts'] });
    },
  });

  const rejectProduct = useMutation({
    mutationFn: rejectProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingProducts'] });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: updateOrderStatusAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });

  // ✅ Auth check
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  const handleStatusChange = (orderId, status) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleUpdateStatus = (orderId) => {
    const status = statusMap[orderId];
    if (status) {
      updateOrderStatus.mutate({ orderId, status });
    }
  };

  const handleApproveCancellation = (orderId) => {
    updateOrderStatus.mutate({ orderId, status: 'Cancelled' });
  };

  const handleRejectCancellation = () => {
    alert('Cancellation rejected. No status change applied.');
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.clear();
    navigate('/');
  };

  // ✅ Pending Products Table
  const renderPendingTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Image</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingProducts.length > 0 ? (
            pendingProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.image ? <img src={product.image} alt="product" width="60" /> : 'N/A'}</TableCell>
                <TableCell>{product.description || 'N/A'}</TableCell>
                <TableCell>${product.price || '0.00'}</TableCell>
                <TableCell>{product.category || 'N/A'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" size="small" onClick={() => approveProduct.mutate(product.id)} sx={{ mr: 1 }}>Approve</Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => rejectProduct.mutate(product.id)}>Reject</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={5} align="center">No pending products</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // ✅ Approved Products Table
  const renderApprovedTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Image</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {approvedProducts.length > 0 ? (
            approvedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.image ? <img src={product.image} alt="product" width="60" /> : 'N/A'}</TableCell>
                <TableCell>{product.description || 'N/A'}</TableCell>
                <TableCell>${product.price || '0.00'}</TableCell>
                <TableCell>{product.category || 'N/A'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={4} align="center">No approved products</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // ✅ Orders Table
  const renderOrdersTable = () => {
    const visibleOrders = orders.filter(order => !order.cancelApproved);

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Update</strong></TableCell>
              <TableCell><strong>Cancel Request</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleOrders.length > 0 ? (
              visibleOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.description || order.product?.description || 'N/A'}</TableCell>
                  <TableCell>${order.orderPrice}</TableCell>
                  <TableCell>{order.username || order.user?.username || 'N/A'}</TableCell>
                  <TableCell>
                    <Select value={statusMap[order.id] || order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} size="small">
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Dispatched">Dispatched</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" size="small" onClick={() => handleUpdateStatus(order.id)}>Update</Button>
                  </TableCell>
                  <TableCell>
                    {order.cancelRequest ? (
                      <>
                        <Button variant="outlined" color="success" size="small" onClick={() => handleApproveCancellation(order.id)} sx={{ mr: 1 }}>Approve</Button>
                        <Button variant="outlined" color="error" size="small" onClick={handleRejectCancellation}>Reject</Button>
                      </>
                    ) : (
                      <Typography color="text.secondary">No request</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} align="center">No orders found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box', backgroundColor: 'black', color: 'white' }}} variant="permanent" anchor="left">
        <Typography variant="h5" sx={{ p: 2, color: 'white' }}>LiFlow Admin Panel</Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton selected={selectedTab === 'pending'} onClick={() => setSelectedTab('pending')}>
              <PendingActionsIcon sx={{ mr: 1, color: 'white' }} />
              <ListItemText primary="Pending Products" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={selectedTab === 'approved'} onClick={() => setSelectedTab('approved')}>
              <CheckCircleIcon sx={{ mr: 1, color: 'white' }} />
              <ListItemText primary="Approved Products" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={selectedTab === 'orders'} onClick={() => setSelectedTab('orders')}>
              <LocalShippingIcon sx={{ mr: 1, color: 'white' }} />
              <ListItemText primary="Delivery Orders" />
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

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {selectedTab === 'pending' ? 'Pending Products' : selectedTab === 'approved' ? 'Approved Products' : 'Delivery Orders'}
        </Typography>
        {selectedTab === 'pending' ? renderPendingTable() : selectedTab === 'approved' ? renderApprovedTable() : renderOrdersTable()}
      </Box>
    </Box>
  );
};

export default AdminPanel;
