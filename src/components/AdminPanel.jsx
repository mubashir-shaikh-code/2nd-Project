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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
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
      const token = localStorage.getItem('token');
      const [approvedRes, pendingRes] = await Promise.all([
        axios.get('https://2nd-project-backend-production.up.railway.app/api/products'),
        axios.get('https://2nd-project-backend-production.up.railway.app/api/products/pending', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setApprovedProducts(approvedRes.data);
      setPendingProducts(pendingRes.data);
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
    navigate('/home');
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [navigate]);

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
                <Button
                  variant="contained"
                  color='success'
                  size="small"
                  onClick={() => approveProduct(product._id)}
                  sx={{ mr: 1 }}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => rejectProduct(product._id)}
                >
                  Reject
                </Button>
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
              <TableCell>{product.category || '0.00'}</TableCell>
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
          <ListItem
            button
            selected={selectedTab === 'pending'}
            onClick={() => setSelectedTab('pending')}
          >
            <PendingActionsIcon sx={{ mr: 1, color: 'white', cursor: 'pointer' }} />
            <ListItemText primary="Pending Products" sx={{ color: 'white', cursor: 'pointer' }} />
          </ListItem>
          <ListItem
            button
            selected={selectedTab === 'approved'}
            onClick={() => setSelectedTab('approved')}
          >
            <CheckCircleIcon sx={{ mr: 1, color: 'white', cursor: 'pointer' }} />
            <ListItemText primary="Approved Products" sx={{ color: 'white', cursor: 'pointer' }} />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, color: 'white', cursor: 'pointer' }} />
            <ListItemText primary="Logout" sx={{ color: 'white', cursor: 'pointer' }} />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {selectedTab === 'pending' ? 'Pending Products' : 'Approved Products'}
        </Typography>
        {selectedTab === 'pending' ? renderPendingTable() : renderApprovedTable()}
      </Box>
    </Box>
  );
};

export default AdminPanel;
