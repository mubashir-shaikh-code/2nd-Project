import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProducts, updateProduct } from '../Redux/Slices/ProductSlice';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { userProducts } = useSelector((state) => state.products);

  const [selectedTab, setSelectedTab] = useState('pending');
  const [editOpen, setEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    description: '',
    price: '',
    category: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(fetchUserProducts(user._email)); // ✅ Fetch only this user's products
  }, [dispatch, user, navigate]);

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setEditedProduct({
      description: product.description,
      price: product.price,
      category: product.category,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentProduct(null);
  };

const handleEditSave = async () => {
  try {
    if (currentProduct) {
      await dispatch(
        updateProduct({ id: currentProduct._id, updatedData: editedProduct })
      ).unwrap();

      // ✅ Force re-fetch from DB after update
      dispatch(fetchUserProducts(user.email));

      handleEditClose();
    }
  } catch (err) {
    console.error('Update failed:', err);
  }
};


  const logout = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  // ✅ Filter products by status
  const filteredProducts = userProducts.filter((p) =>
    selectedTab === 'approved' ? p.status === 'approved' : p.status !== 'approved'
  );

  const renderTable = (products) => (
    <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell sx={{ color: product.status === 'approved' ? 'green' : 'orange' }}>
                  {product.status}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(product)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No {selectedTab === 'approved' ? 'approved' : 'pending'} products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'black',
            color: 'white',
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open
      >
        <Typography variant="h5" sx={{ p: 2, color: 'white' }}>
          LiFlow User Panel
        </Typography>
        <List>
          <ListItem
            button
            selected={selectedTab === 'pending'}
            onClick={() => setSelectedTab('pending')}
          >
            <PendingActionsIcon sx={{ mr: 1, color: 'white' }} />
            <ListItemText primary="Pending Products" />
          </ListItem>
          <ListItem
            button
            selected={selectedTab === 'approved'}
            onClick={() => setSelectedTab('approved')}
          >
            <CheckCircleIcon sx={{ mr: 1, color: 'white' }} />
            <ListItemText primary="Approved Products" />
          </ListItem>
          <ListItem button onClick={logout}>
            <LogoutIcon sx={{ mr: 1, color: 'white' }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ mt: 10, flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {selectedTab === 'pending' ? 'Pending Products' : 'Approved Products'}
        </Typography>
        {renderTable(filteredProducts)}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editedProduct.description}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={editedProduct.price}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={editedProduct.category}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, category: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;
