import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePic: '',
  });
  const [previewPic, setPreviewPic] = useState('');

  const API_BASE = 'https://2nd-project-backend-production.up.railway.app';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: data.name,
          email: data.email,
          password: '',
          profilePic: data.profilePic,
        });
        setPreviewPic(data.profilePic);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 20 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
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
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleUpdate}>
            Update Profile
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
