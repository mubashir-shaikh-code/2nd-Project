// components/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProducts,
  filterProductsByUser,
  updateProduct,
} from '../Redux/Slices/ProductSlice';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { userProducts, status } = useSelector((state) => state.products);

  const [editOpen, setEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    description: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      dispatch(filterProductsByUser(user.email));
    }
  }, [dispatch]);

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

  const handleEditSave = () => {
    if (currentProduct) {
      dispatch(updateProduct({ id: currentProduct._id, updatedData: editedProduct }))
        .unwrap()
        .then(() => {
          setEditOpen(false);
          setCurrentProduct(null);
        });
    }
  };

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
        <Paper sx={{ overflowX: 'auto', mt: 5, mb: 5 }}>
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
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(product)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={editOpen} onClose={handleEditClose}>
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
    </Container>
  );
};

export default UserDashboard;
