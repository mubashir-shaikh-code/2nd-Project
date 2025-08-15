import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  IconButton,
  CircularProgress,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = 'http://localhost:5000';

const Profile = () => {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePic: '',
  });
  const [previewPic, setPreviewPic] = useState('');

  // ✅ Fetch profile data
  const { isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        username: data.username,
        email: data.email,
        password: '',
        profilePic: data.profilePic,
      });
      setPreviewPic(data.profilePic);
      return data;
    },
    enabled: !!token,
  });

  // ✅ Update profile mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    onSuccess: () => {
      alert('Profile updated successfully!');
    },
    onError: (err) => {
      console.error('Update failed:', err);
      alert('Failed to update profile');
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    mutate();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 20 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Avatar src={previewPic} sx={{ width: 80, height: 80, margin: 'auto' }} />
            <IconButton component="label">
              <PhotoCamera />
              <input type="file" hidden accept="image/*" onChange={handlePicUpload} />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="UserName"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleUpdate}
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Update Profile'}
            </Button>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Profile;
