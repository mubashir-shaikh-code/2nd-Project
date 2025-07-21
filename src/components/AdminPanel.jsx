import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const drawerWidth = 240;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [pendingProducts, setPendingProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        'https://2nd-project-backend-production.up.railway.app/api/products'
      );
      const data = res.data;

      setPendingProducts(data.filter((p) => p.status === 'pending'));
      setApprovedProducts(data.filter((p) => p.status === 'approved'));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const approveProduct = async (id) => {
    try {
      await axios.put(
        `https://2nd-project-backend-production.up.railway.app/api/products/approve/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchProducts();
    } catch (err) {
      console.error('Error approving product:', err);
    }
  };

  const rejectProduct = async (id) => {
    try {
      await axios.patch(
        `https://2nd-project-backend-production.up.railway.app/api/products/reject/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchProducts();
    } catch (err) {
      console.error('Error rejecting product:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const renderProducts = (products, isPending) => (
    <Box sx={{ padding: 2 }}>
      {products.length === 0 ? (
        <Typography>No products available.</Typography>
      ) : (
        products.map((product) => (
          <Box
            key={product._id}
            sx={{
              border: '1px solid #ccc',
              mb: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#fff',
            }}
          >
            <Typography variant="h6">{product.name}</Typography>
            <Typography>Category: {product.category}</Typography>
            <Typography>Description: {product.description}</Typography>

            {isPending && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => approveProduct(product._id)}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => rejectProduct(product._id)}
                >
                  Reject
                </Button>
              </Box>
            )}
          </Box>
        ))
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography variant="h5" sx={{ p: 2 }}>
          Admin Panel
        </Typography>
        <List>
          <ListItem
            button
            selected={selectedTab === 'pending'}
            onClick={() => setSelectedTab('pending')}
          >
            <PendingActionsIcon sx={{ mr: 1 }} />
            <ListItemText primary="Pending Products" />
          </ListItem>
          <ListItem
            button
            selected={selectedTab === 'approved'}
            onClick={() => setSelectedTab('approved')}
          >
            <CheckCircleIcon sx={{ mr: 1 }} />
            <ListItemText primary="Approved Products" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {selectedTab === 'pending' ? 'Pending Products' : 'Approved Products'}
        </Typography>
        {selectedTab === 'pending'
          ? renderProducts(pendingProducts, true)
          : renderProducts(approvedProducts, false)}
      </Box>
    </Box>
  );
};

export default AdminPanel;
