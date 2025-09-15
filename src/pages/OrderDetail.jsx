import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Paper, Box, Typography, Divider, Grid, Chip, Button } from '@mui/material';
import { fetchUserOrders } from '../store/slices/ordersSlice';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.orders);
  const { isAuthenticated } = useSelector((s) => s.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!orders || orders.length === 0) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isAuthenticated, navigate, orders?.length]);

  const order = orders?.find(o => String(o.orderId) === String(orderId));

  if (loading && !order) {
    return (
      <Container maxWidth="lg"><Typography sx={{ mt: 4 }}>טוען הזמנה...</Typography></Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>הזמנה לא נמצאה</Typography>
          <Button variant="contained" onClick={() => navigate('/orders')}>חזרה להזמנות</Button>
        </Paper>
      </Container>
    );
  }

  const totalItems = order.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0;
  const dateStr = order.orderDate ? new Date(order.orderDate).toLocaleString('he-IL') : '';

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: { xs: 3, md: 5 }, mt: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>הזמנה #{order.orderId}</Typography>
          <Chip label={order.status || 'Pending'} color="primary" variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>תאריך: {dateStr}</Typography>
        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>פרטי פריטים</Typography>
        <Grid container spacing={2}>
          {order.items?.map((it, idx) => (
            <Grid item xs={12} key={idx}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {it.productName || `מוצר ${it.productId}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    כמות: {it.quantity} יחידות
                  </Typography>
                </Box>
                <Typography variant="body1" color="primary.main">
                  ₪{Number(it.price * it.quantity).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>סה"כ פריטים:</Typography>
            <Typography>{totalItems}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>סה"כ לתשלום:</Typography>
            <Typography sx={{ fontWeight: 'bold' }} color="primary.main">₪{Number(order.totalPrice).toFixed(2)}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/orders')}>חזרה להזמנות</Button>
          <Button variant="contained" onClick={() => navigate('/products')}>המשך קניות</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderDetail;
