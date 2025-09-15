import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingBasket as OrderIcon,
  CalendarToday as DateIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders, deleteOrder } from '../store/slices/ordersSlice';

const Orders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user]);

  // רענון אוטומטי כל 30 שניות כשהמשתמש מחובר
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      dispatch(fetchUserOrders());
    }, 30000);
    return () => clearInterval(id);
  }, [dispatch, user]);
  
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הזמנה זו?')) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
      } catch (error) {
        // השגיאה מטופלת ב-Redux
      }
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'התקבל':
        return 'default';
      case 'בטיפול':
        return 'warning';
      case 'שולם':
        return 'success';
      case 'נשלח':
        return 'info';
      case 'הושלם':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'התקבל':
        return 'התקבל';
      case 'בטיפול':
        return 'בטיפול';
      case 'שולם':
        return 'שולם';
      case 'נשלח':
        return 'נשלח';
      case 'הושלם':
        return 'הושלם';
      default:
        return status;
    }
  };

  // שמירת סטטוסים אחרונים מקומית כדי לזהות שינוי
  const lastStatuses = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('cb_last_order_statuses') || '{}');
    } catch {
      return {};
    }
  }, []);

  const statusChanged = (order) => {
    const last = lastStatuses[String(order.orderId)];
    return last && last !== order.status;
  };

  useEffect(() => {
    if (Array.isArray(orders) && orders.length > 0) {
      const map = {};
      orders.forEach(o => { if (o?.orderId) map[String(o.orderId)] = o.status; });
      localStorage.setItem('cb_last_order_statuses', JSON.stringify(map));
    }
  }, [orders]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {/* כותרת הדף */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
          }}
        >
          ההזמנות שלי
        </Typography>
        <Typography variant="h6" color="text.secondary">
          היסטוריית ההזמנות שלך וסטטוס המשלוחים
        </Typography>
      </Box>
      
      {/* הודעת שגיאה */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body1">{error}</Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => dispatch(fetchUserOrders())}
              disabled={loading}
            >
              נסה שוב
            </Button>
          </Box>
        </Alert>
      )}
      
      {/* רשימת הזמנות */}
      {orders.length === 0 ? (
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: 'center' }}>
          <OrderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
            אין הזמנות עדיין
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            התחל בקניות כדי לראות את ההזמנות שלך כאן
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
          >
            התחל בקניות
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.orderId}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  {/* כותרת ההזמנה */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        הזמנה #{order.orderId}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <DateIcon color="primary" sx={{ fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(order.orderDate)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={getStatusText(order.status)}
                          color={getStatusColor(order.status)}
                          variant="outlined"
                          size="small"
                        />
                        {statusChanged(order) && (
                          <Chip label="סטטוס עודכן" color="warning" size="small" />
                        )}
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {/* פרטי ההזמנה */}
                  <Grid container spacing={3}>
                    {/* רשימת מוצרים */}
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        מוצרים בהזמנה
                      </Typography>
                      
                      {order.items?.map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1,
                            borderBottom: index < order.items.length - 1 ? 1 : 0,
                            borderColor: 'divider',
                          }}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {item.productName || `מוצר ${item.productId}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              כמות: {item.quantity} יחידות
                            </Typography>
                          </Box>
                          <Typography variant="body1" color="primary.main">
                            ₪{(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                    
                    {/* סיכום ההזמנה */}
                    <Grid item xs={12} md={4}>
                      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          סיכום הזמנה
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">סך הכל מוצרים:</Typography>
                          <Typography variant="body2">
                            {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">משלוח:</Typography>
                          <Typography variant="body2">
                            {order.totalPrice >= 200 ? 'חינם' : '₪30'}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            סה"כ לתשלום:
                          </Typography>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            ₪{order.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ViewIcon />}
                            fullWidth
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                          >
                            צפה בפרטים
                          </Button>
                          
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            fullWidth
                            onClick={() => handleDeleteOrder(order.orderId)}
                          >
                            מחק הזמנה
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  {/* מידע נוסף */}
                  <Box sx={{ mt: 3, p: 2, background: 'linear-gradient(135deg, #F0E2D2 0%, #F8EFE4 100%)', borderRadius: 2, border: '1px solid rgba(139,69,19,0.25)' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PaymentIcon color="primary" sx={{ fontSize: 20 }} />
                          <Typography variant="body2" color="primary.dark">
                            תשלום: {order.status === 'שולם' ? 'שולם' : 'בהמתנה'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShippingIcon color="primary" sx={{ fontSize: 20 }} />
                          <Typography variant="body2" color="primary.dark">
                            משלוח: {order.status === 'נשלח' ? 'נשלח' : 'בהכנה'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DateIcon color="primary" sx={{ fontSize: 20 }} />
                          <Typography variant="body2" color="primary.dark">
                            תאריך: {new Date(order.orderDate).toLocaleDateString('he-IL')}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* מידע נוסף */}
      <Box sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            מידע על הזמנות
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <PaymentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  תשלום מאובטח
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  כל התשלומים שלנו מאובטחים עם הצפנה מתקדמת
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <ShippingIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  משלוח מהיר
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  משלוח מהיר ואמין לכל רחבי הארץ תוך 1-3 ימי עסקים
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <OrderIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  מעקב הזמנות
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  מעקב מלא על ההזמנה שלך משלב ההזמנה ועד למשלוח
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Orders;
