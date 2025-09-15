import React, { useEffect } from 'react';
import { Container, Box, Typography, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProductAdd = () => {
  const navigate = useNavigate();
  const { isAdmin } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          הוספת מוצר חדש
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          בקרוב תתווסף כאן אפשרות להוסיף מוצרים חדשים למערכת.
        </Alert>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          בינתיים ניתן לנהל מוצרים קיימים בעמוד ניהול המוצרים.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/admin/products')}>
          חזרה לניהול מוצרים
        </Button>
      </Box>
    </Container>
  );
};

export default AdminProductAdd;


