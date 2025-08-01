import React, { useEffect, useState, useCallback } from 'react';
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
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';

const drawerWidth = 240;

const UserPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [selectedTab, setSelectedTab] = useState('pending');
  const [pendingProducts, setPendingProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchUserProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token missing');
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.get(
        'https://2nd-project-backend-production.up.railway.app/api/products/user',
        config
      );

      const pending = res.data.filter((product) => product.status === 'pending');
      const approved = res.data.filter((product) => product.status === 'approved');

      setPendingProducts(pending);
      setApprovedProducts(approved);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching user products:', error);
      setErrorMessage('Failed to fetch your products. Please try again.');
      if (error.response?.status === 401) {
        alert('Unauthorized. Please login again.');
        localStorage.clear();
        dispatch(logoutAction());
        navigate('/login');
      }
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserProducts();
  }, [fetchUserProducts, user, navigate]);

  const logout = () => {
    dispatch(logoutAction());
    localStorage.clear();
    navigate('/');
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://2nd-project-backend-production.up.railway.app/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserProducts(); // Refresh product list
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product');
    }
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
            <ListItemButton onClick={logout}>
              <LogoutIcon sx={{ mr: 1, color: 'white' }} />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt:10 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {selectedTab === 'pending' ? 'My Pending Products' : 'My Approved Products'}
        </Typography>

        {errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : selectedTab === 'pending' ? (
          renderProductTable(pendingProducts, true)
        ) : (
          renderProductTable(approvedProducts, false)
        )}
      </Box>
    </Box>
  );
};

export default UserPanel;
