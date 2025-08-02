import React, { useEffect, useState, useCallback } from 'react';
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
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';

const drawerWidth = 240;

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState('pending');
  const [pendingProducts, setPendingProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [deliveryOrders, setDeliveryOrders] = useState([]);

  const fetchAllProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [approvedRes, pendingRes] = await Promise.all([
        axios.get('https://2nd-project-backend-production.up.railway.app/api/products'),
        axios.get('https://2nd-project-backend-production.up.railway.app/api/products/pending', config),
      ]);

      setApprovedProducts(approvedRes.data);
      setPendingProducts(pendingRes.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        alert('Unauthorized. Please login again.');
        localStorage.clear();
        navigate('/login');
      }
    }
  }, [navigate]);

  const fetchAllOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get('https://2nd-project-backend-production.up.railway.app/api/orders', config);
      setDeliveryOrders(res.data);
    } catch (error) {
      console.error('Error fetching delivery orders:', error);
    }
  }, []);

  const approveProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.patch(`https://2nd-project-backend-production.up.railway.app/api/products/approve/${id}`, null, config);
      fetchAllProducts();
    } catch (err) {
      console.error('Error approving product:', err);
    }
  };

  const rejectProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.patch(`https://2nd-project-backend-production.up.railway.app/api/products/reject/${id}`, null, config);
      fetchAllProducts();
    } catch (err) {
      console.error('Error rejecting product:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`https://2nd-project-backend-production.up.railway.app/api/orders/${orderId}`, { status: newStatus }, config);
      fetchAllOrders();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/login');
      return;
    }
    fetchAllProducts();
    fetchAllOrders();
  }, [fetchAllProducts, fetchAllOrders, navigate]);

  const renderPendingTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.description || 'N/A'}</TableCell>
              <TableCell>${product.price || '0.00'}</TableCell>
              <TableCell>{product.category || 'N/A'}</TableCell>
              <TableCell>
                <Button variant="contained" color="success" size="small" onClick={() => approveProduct(product._id)} sx={{ mr: 1 }}>Approve</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => rejectProduct(product._id)}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderApprovedTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {approvedProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.description || 'N/A'}</TableCell>
              <TableCell>${product.price || '0.00'}</TableCell>
              <TableCell>{product.category || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderDeliveryOrders = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Product</strong></TableCell>
            <TableCell><strong>User</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveryOrders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.productName || 'N/A'}</TableCell>
              <TableCell>{order.userName || 'N/A'}</TableCell>
              <TableCell>
                <RadioGroup
                  row
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <FormControlLabel value="processing" control={<Radio />} label="Processing" />
                  <FormControlLabel value="dispatched" control={<Radio />} label="Dispatched" />
                  <FormControlLabel value="delivered" control={<Radio />} label="Delivered" />
                </RadioGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
          LiFlow Admin Panel
        </Typography>
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
            <ListItemButton selected={selectedTab === 'delivery'} onClick={() => setSelectedTab('delivery')}>
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
          {selectedTab === 'pending'
            ? 'Pending Products'
            : selectedTab === 'approved'
            ? 'Approved Products'
            : 'Delivery Orders'}
        </Typography>

        {selectedTab === 'pending'
          ? renderPendingTable()
          : selectedTab === 'approved'
          ? renderApprovedTable()
          : renderDeliveryOrders()}
      </Box>
    </Box>
  );
};

export default AdminPanel;
