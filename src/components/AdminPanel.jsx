import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';

const drawerWidth = 240;

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState('pendingProducts');
  const [pendingProducts, setPendingProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);

  const token = localStorage.getItem('token');
  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchAllProducts = useCallback(async () => {
    try {
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
  }, [config, navigate]);

  const fetchAllOrders = useCallback(async () => {
    try {
      const res = await axios.get(
        'https://2nd-project-backend-production.up.railway.app/api/order/all',
        config
      );
      const orders = res.data;
      setPendingOrders(orders.filter((o) => o.status === 'pending'));
      setApprovedOrders(orders.filter((o) => o.status !== 'pending'));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [config]);

  const approveProduct = async (id) => {
    try {
      await axios.patch(
        `https://2nd-project-backend-production.up.railway.app/api/products/approve/${id}`,
        null,
        config
      );
      fetchAllProducts();
    } catch (err) {
      console.error('Error approving product:', err);
    }
  };

  const rejectProduct = async (id) => {
    try {
      await axios.patch(
        `https://2nd-project-backend-production.up.railway.app/api/products/reject/${id}`,
        null,
        config
      );
      fetchAllProducts();
    } catch (err) {
      console.error('Error rejecting product:', err);
    }
  };

  const approveOrder = async (id) => {
    try {
      await axios.put(
        `https://2nd-project-backend-production.up.railway.app/api/order/approve/${id}`,
        null,
        config
      );
      fetchAllOrders();
    } catch (error) {
      console.error('Error approving order:', error);
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

  const renderTable = (rows, actions = null) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Status</TableCell>
            {actions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.userId?.name || 'N/A'}</TableCell>
              <TableCell>{order.productId?.name || 'N/A'}</TableCell>
              <TableCell>{order.status}</TableCell>
              {actions && (
                <TableCell>
                  <Button
                    color="success"
                    variant="contained"
                    size="small"
                    onClick={() => actions(order._id)}
                  >
                    Approve
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderProductTable = (products, withActions) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            {withActions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.description || 'N/A'}</TableCell>
              <TableCell>${product.price || '0.00'}</TableCell>
              <TableCell>{product.category || 'N/A'}</TableCell>
              {withActions && (
                <TableCell>
                  <Button color="success" variant="contained" size="small" onClick={() => approveProduct(product._id)} sx={{ mr: 1 }}>
                    Approve
                  </Button>
                  <Button color="error" variant="outlined" size="small" onClick={() => rejectProduct(product._id)}>
                    Reject
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'pendingProducts':
        return renderProductTable(pendingProducts, true);
      case 'approvedProducts':
        return renderProductTable(approvedProducts, false);
      case 'pendingOrders':
        return renderTable(pendingOrders, approveOrder);
      case 'approvedOrders':
        return renderTable(approvedOrders);
      default:
        return null;
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
          LiFlow Admin Panel
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton selected={selectedTab === 'pendingProducts'} onClick={() => setSelectedTab('pendingProducts')}>
              <PendingActionsIcon sx={{ mr: 1 }} />
              <ListItemText primary="Pending Products" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={selectedTab === 'approvedProducts'} onClick={() => setSelectedTab('approvedProducts')}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Approved Products" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={selectedTab === 'pendingOrders'} onClick={() => setSelectedTab('pendingOrders')}>
              <PendingActionsIcon sx={{ mr: 1 }} />
              <ListItemText primary="Pending Orders" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={selectedTab === 'approvedOrders'} onClick={() => setSelectedTab('approvedOrders')}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Approved Orders" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <LogoutIcon sx={{ mr: 1 }} />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {selectedTab.replace(/([A-Z])/g, ' $1')}
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminPanel;
