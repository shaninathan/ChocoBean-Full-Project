import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  IconButton,
  TextField,
  Divider,
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingBasket as CheckoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items, total } = useSelector((state) => state.cart);
  
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    } else if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    }
  };
  
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const handleContinueShopping = () => {
    navigate('/products');
  };
  
  if (items.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom color="text.secondary">
            העגלה שלך ריקה
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            הוסף מוצרים לעגלה כדי להתחיל בקניות
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinueShopping}
            startIcon={<ArrowBackIcon />}
          >
            התחל בקניות
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {/* כותרת הדף */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
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
          עגלת הקניות שלך
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {items.length} מוצרים בעגלה
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* רשימת המוצרים */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                מוצרים בעגלה
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClearCart}
                startIcon={<DeleteIcon />}
              >
                רוקן עגלה
              </Button>
            </Box>
          </Box>
          
          {items.map((item) => (
            <Card key={item.productId} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  {/* תמונת המוצר */}
                  <Grid item xs={3} sm={2}>
                    <CardMedia
                      component="img"
                      height={80}
                      image={item.imagePath || '/public/לוגו.jpg'}
                      alt={item.productName}
                      sx={{
                        objectFit: 'cover',
                        borderRadius: 1,
                        backgroundColor: 'secondary.light',
                      }}
                      onError={(e) => {
                        e.target.src = '/public/לוגו.jpg';
                      }}
                    />
                  </Grid>
                  
                  {/* פרטי המוצר */}
                  <Grid item xs={6} sm={4}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₪{item.price} ליחידה
                    </Typography>
                  </Grid>
                  
                  {/* כמות */}
                  <Grid item xs={3} sm={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      
                      <TextField
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            handleQuantityChange(item.productId, value);
                          }
                        }}
                        type="number"
                        size="small"
                        inputProps={{
                          min: 1,
                          max: 99,
                          style: { textAlign: 'center', width: 50 },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            textAlign: 'center',
                          },
                        }}
                      />
                      
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= 99}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  {/* מחיר כולל */}
                  <Grid item xs={6} sm={2}>
                    <Typography variant="h6" color="primary.main">
                      ₪{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                  
                  {/* כפתור מחיקה */}
                  <Grid item xs={6} sm={2}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.productId)}
                      sx={{ ml: 'auto' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
        
        {/* סיכום הזמנה */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              סיכום הזמנה
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">סך הכל מוצרים:</Typography>
                <Typography variant="body1">{items.length}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">סך הכל יחידות:</Typography>
                <Typography variant="body1">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" color="primary.main">סה"כ לתשלום:</Typography>
                <Typography variant="h6" color="primary.main">₪{total.toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                משלוח חינם בקנייה מעל ₪200
              </Typography>
            </Alert>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCheckout}
                startIcon={<CheckoutIcon />}
                disabled={items.length === 0}
              >
                המשך לתשלום
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleContinueShopping}
                startIcon={<ArrowBackIcon />}
              >
                המשך בקניות
              </Button>
            </Box>
            
            <Box sx={{ mt: 3, p: 2, background: 'linear-gradient(135deg, #F0E2D2 0%, #F8EFE4 100%)', borderRadius: 1, border: '1px solid rgba(139,69,19,0.25)' }}>
              <Typography variant="body2" color="primary.dark" align="center">
                💳 תשלום מאובטח
              </Typography>
              <Typography variant="body2" color="primary.dark" align="center">
                🚚 משלוח מהיר לכל הארץ
              </Typography>
              <Typography variant="body2" color="primary.dark" align="center">
                💝 אחריות מלאה על כל המוצרים
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
