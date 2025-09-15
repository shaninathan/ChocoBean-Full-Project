import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Container,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Breadcrumbs,
  Link,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchCategories } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import CartSnackbar from '../components/CartSnackbar';

const ProductDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct, categories, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
    }
    dispatch(fetchCategories());
  }, [dispatch, id]);
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ product: currentProduct, quantity }));
      setSnackbarOpen(true);
    }
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : '';
  };
  
  const getProductImage = (product) => {
    const categoryName = getCategoryName(product.categoryId);
    if (categoryName) {
      return `/public/${categoryName}/${product.productName}.jpg`;
    }
    return '/public/לוגו.jpg';
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }
  
  if (error || !currentProduct) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          שגיאה בטעינת המוצר: {error || 'המוצר לא נמצא'}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            sx={{ cursor: 'pointer' }}
          >
            דף הבית
          </Link>
          <Link
            color="inherit"
            href="/products"
            onClick={(e) => {
              e.preventDefault();
              navigate('/products');
            }}
            sx={{ cursor: 'pointer' }}
          >
            מוצרים
          </Link>
          <Typography color="text.primary">{currentProduct.productName}</Typography>
        </Breadcrumbs>
      </Box>
      
      {/* כפתור חזרה */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        חזור
      </Button>
      
      <Grid container spacing={4}>
        {/* תמונת המוצר */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              height={isMobile ? 300 : 400}
              image={getProductImage(currentProduct)}
              alt={currentProduct.productName}
              sx={{
                objectFit: 'cover',
                backgroundColor: '#F3E4D4',
              }}
              onError={(e) => {
                e.target.src = '/public/לוגו.jpg';
              }}
            />
          </Card>
        </Grid>
        
        {/* פרטי המוצר */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* כותרת וקטגוריה */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                {currentProduct.productName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label={getCategoryName(currentProduct.categoryId)}
                  color="primary"
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      sx={{
                        color: index < 4 ? 'warning.main' : 'grey.300',
                        fontSize: 20,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            
            {/* מחיר */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="primary.main" gutterBottom>
                ₪{currentProduct.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentProduct.unitsInPackage > 1 
                  ? `${currentProduct.unitsInPackage} יחידות בחבילה`
                  : 'יחידה אחת'
                }
              </Typography>
            </Box>
            
            {/* תיאור */}
            <Box sx={{ mb: 4, flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                תיאור המוצר
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {currentProduct.description || 'תיאור מפורט יופיע בקרוב...'}
              </Typography>
            </Box>
            
            {/* בחירת כמות */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                כמות
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      handleQuantityChange(value);
                    }
                  }}
                  type="number"
                  inputProps={{
                    min: 1,
                    max: 99,
                    style: { textAlign: 'center' },
                  }}
                  sx={{
                    width: 80,
                    '& .MuiOutlinedInput-root': {
                      textAlign: 'center',
                    },
                  }}
                />
                
                <IconButton
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
            
            {/* כפתורי פעולה */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                sx={{
                  flex: { xs: '1 1 100%', sm: '1 1 auto' },
                  minWidth: 200,
                }}
              >
                הוסף לעגלה
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/products')}
                sx={{
                  flex: { xs: '1 1 100%', sm: '1 1 auto' },
                  minWidth: 200,
                }}
              >
                המשך בקניות
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* מידע נוסף */}
      <Box sx={{ mt: 6 }}>
        <Divider sx={{ mb: 4 }} />
        
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          מידע נוסף
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Typography variant="h5" color="white">
                  ☕
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                איכות מעולה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                המוצר שלנו מיוצר מחומרים איכותיים ונבחרים בקפידה
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Typography variant="h5" color="white">
                  🚚
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                משלוח מהיר
              </Typography>
              <Typography variant="body2" color="text.secondary">
                משלוח מהיר ואמין לכל רחבי הארץ תוך 1-3 ימי עסקים
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Typography variant="h5" color="white">
                  💝
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                אחריות מלאה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                אחריות מלאה על כל המוצרים שלנו עם אפשרות החזרה
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* הודעה קובצת */}
      <CartSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        productName={currentProduct?.productName}
        quantity={quantity}
      />
    </Container>
  );
};

export default ProductDetail;
