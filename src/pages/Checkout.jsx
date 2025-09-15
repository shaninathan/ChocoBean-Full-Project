import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder } from '../store/slices/ordersSlice';
import { clearCart } from '../store/slices/cartSlice';
import {
  CreditCard as CardIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

// סכמת ולידציה
const schema = yup.object({
  cardNumber: yup
    .string()
    .matches(/^[0-9]{16}$/, 'מספר כרטיס חייב להכיל 16 ספרות')
    .required('מספר כרטיס הוא שדה חובה'),
  cardHolder: yup
    .string()
    .min(2, 'שם בעל הכרטיס חייב להכיל לפחות 2 תווים')
    .required('שם בעל הכרטיס הוא שדה חובה'),
  expiryMonth: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])$/, 'חודש לא תקין')
    .required('חודש הוא שדה חובה'),
  expiryYear: yup
    .string()
    .matches(/^[0-9]{2}$/, 'שנה לא תקינה')
    .required('שנה היא שדה חובה'),
  cvv: yup
    .string()
    .matches(/^[0-9]{3,4}$/, 'CVV חייב להכיל 3-4 ספרות')
    .required('CVV הוא שדה חובה'),
  firstName: yup
    .string()
    .min(2, 'שם פרטי חייב להכיל לפחות 2 תווים')
    .required('שם פרטי הוא שדה חובה'),
  lastName: yup
    .string()
    .min(2, 'שם משפחה חייב להכיל לפחות 2 תווים')
    .required('שם משפחה הוא שדה חובה'),
  phone: yup
    .string()
    .matches(/^[0-9-+\s()]+$/, 'מספר טלפון לא תקין')
    .required('מספר טלפון הוא שדה חובה'),
  address: yup
    .string()
    .min(5, 'כתובת חייבת להכיל לפחות 5 תווים')
    .required('כתובת היא שדה חובה'),
  city: yup
    .string()
    .min(2, 'עיר חייבת להכיל לפחות 2 תווים')
    .required('עיר היא שדה חובה'),
  postalCode: yup
    .string()
    .matches(/^[0-9]{5,7}$/, 'מיקוד חייב להכיל 5-7 ספרות')
    .required('מיקוד הוא שדה חובה'),
}).required();

const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data) => {
    if (!user || items.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // יצירת אובייקט הזמנה
      const orderData = {
        orderId: 0,
        userId: user.id,
        orderDate: new Date().toISOString(),
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: total,
        status: 'Pending',
      };
      
      // שליחת ההזמנה
      await dispatch(createOrder(orderData)).unwrap();
      
      // ניקוי העגלה
      dispatch(clearCart());
      
      setSubmitSuccess(true);
      
      // הפניה לדף ההזמנות אחרי 3 שניות
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
      
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ניתובים חייבים להתבצע בתוך useEffect כדי למנוע אזהרות React Router
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);
  
  const shippingCost = total >= 200 ? 0 : 30;
  const finalTotal = total + shippingCost;
  
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
          תשלום והזמנה
        </Typography>
        <Typography variant="h6" color="text.secondary">
          השלם את פרטי התשלום והמשלוח
        </Typography>
      </Box>
      
      {/* הודעת הצלחה */}
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ההזמנה נוצרה בהצלחה! תועבר לדף ההזמנות בעוד מספר שניות...
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* טופס תשלום */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              פרטי תשלום
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {/* פרטי כרטיס אשראי */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  <CardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  כרטיס אשראי
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      {...register('cardNumber')}
                      fullWidth
                      label="מספר כרטיס"
                      placeholder="1234 5678 9012 3456"
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      {...register('cardHolder')}
                      fullWidth
                      label="שם בעל הכרטיס"
                      placeholder="שם מלא כפי שמופיע בכרטיס"
                      error={!!errors.cardHolder}
                      helperText={errors.cardHolder?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      {...register('expiryMonth')}
                      fullWidth
                      label="חודש"
                      placeholder="MM"
                      error={!!errors.expiryMonth}
                      helperText={errors.expiryMonth?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      {...register('expiryYear')}
                      fullWidth
                      label="שנה"
                      placeholder="YY"
                      error={!!errors.expiryYear}
                      helperText={errors.expiryYear?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('cvv')}
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      error={!!errors.cvv}
                      helperText={errors.cvv?.message}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              {/* פרטי משלוח */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  פרטי משלוח
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('firstName')}
                      fullWidth
                      label="שם פרטי"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('lastName')}
                      fullWidth
                      label="שם משפחה"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('phone')}
                      fullWidth
                      label="מספר טלפון"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('city')}
                      fullWidth
                      label="עיר"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      {...register('address')}
                      fullWidth
                      label="כתובת מלאה"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('postalCode')}
                      fullWidth
                      label="מיקוד"
                      error={!!errors.postalCode}
                      helperText={errors.postalCode?.message}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              {/* כפתור תשלום */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <PaymentIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {isSubmitting ? 'מעבד תשלום...' : `שלם ₪${finalTotal.toFixed(2)}`}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* סיכום הזמנה */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              <CartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              סיכום הזמנה
            </Typography>
            
            {/* רשימת מוצרים */}
            <Box sx={{ mb: 3 }}>
              {items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: index < items.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      כמות: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="primary.main">
                    ₪{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* חישוב עלויות */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">סך הכל מוצרים:</Typography>
                <Typography variant="body1">₪{total.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">משלוח:</Typography>
                <Typography variant="body1">
                  {shippingCost === 0 ? 'חינם' : `₪${shippingCost.toFixed(2)}`}
                </Typography>
              </Box>
              
              {shippingCost > 0 && (
                <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
                  משלוח חינם בקנייה מעל ₪200
                </Alert>
              )}
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  סה"כ לתשלום:
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  ₪{finalTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            {/* מידע נוסף */}
            <Box sx={{ p: 2, background: 'linear-gradient(135deg, #F0E2D2 0%, #F8EFE4 100%)', borderRadius: 2, border: '1px solid rgba(139,69,19,0.25)' }}>
              <Typography variant="body2" color="primary.dark" align="center" gutterBottom>
                💳 תשלום מאובטח
              </Typography>
              <Typography variant="body2" color="primary.dark" align="center" gutterBottom>
                🚚 משלוח מהיר לכל הארץ
              </Typography>
              <Typography variant="body2" color="primary.dark" align="center">
                💝 אחריות מלאה על כל המוצרים
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* מידע נוסף */}
      <Box sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            מידע על תשלום ומשלוח
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  תשלום מאובטח
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  כל התשלומים שלנו מאובטחים עם הצפנה מתקדמת ותקן PCI DSS
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <LocationIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
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
                <PaymentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  אחריות מלאה
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  אחריות מלאה על כל המוצרים עם אפשרות החזרה תוך 30 יום
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Checkout;
