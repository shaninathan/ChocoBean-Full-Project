import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import CartSnackbar from '../components/CartSnackbar';

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const { products, categories, loading, error } = useSelector((state) => state.products);
  
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);
  
  // פילטור מוצרים לפי קטגוריה וחיפוש
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.categoryId === parseInt(selectedCategory);
    const matchesSearch = !searchTerm || 
      product.productName.includes(searchTerm) || 
      product.description?.includes(searchTerm);
    
    return matchesCategory && matchesSearch;
  });
  
  // מיון מוצרים
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.productName.localeCompare(b.productName);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });
  
  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    setAddedProduct(product);
    setSnackbarOpen(true);
  };
  
  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : '';
  };
  
  const getProductImage = (product) => {
    const categoryName = getCategoryName(product.categoryId);
    if (categoryName) {
      // ניסיון למצוא תמונה לפי שם המוצר בקטגוריה
      return `/public/${categoryName}/${product.productName}.jpg`;
    }
    return '/public/לוגו.jpg'; // תמונת ברירת מחדל
  };
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          שגיאה בטעינת המוצרים: {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl">
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
          המוצרים שלנו
        </Typography>
        <Typography variant="h6" color="text.secondary">
          גלו את המבחר הרחב שלנו של מוצרי קפה ושוקולד איכותיים
        </Typography>
      </Box>
      
      {/* פילטרים ומיון */}
      <Box sx={{ mb: 4, p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #F0E2D2 0%, #F8EFE4 100%)', border: '1px solid rgba(139,69,19,0.22)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>קטגוריה</InputLabel>
              <Select
                value={selectedCategory}
                label="קטגוריה"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">כל הקטגוריות</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="חיפוש מוצרים"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>מיון לפי</InputLabel>
              <Select
                value={sortBy}
                label="מיון לפי"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">שם מוצר</MenuItem>
                <MenuItem value="price-low">מחיר: נמוך לגבוה</MenuItem>
                <MenuItem value="price-high">מחיר: גבוה לנמוך</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              נמצאו {sortedProducts.length} מוצרים
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      {/* רשימת המוצרים */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : sortedProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            לא נמצאו מוצרים
          </Typography>
          <Typography variant="body1" color="text.secondary">
            נסה לשנות את הפילטרים או החיפוש
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={getProductImage(product)}
                  alt={product.productName}
                  sx={{
                    objectFit: 'cover',
                    backgroundColor: '#F3E4D4',
                  }}
                  onError={(e) => {
                    e.target.src = '/public/לוגו.jpg';
                  }}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {product.productName}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getCategoryName(product.categoryId)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    ₪{product.price}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.unitsInPackage > 1 
                      ? `${product.unitsInPackage} יחידות בחבילה`
                      : 'יחידה אחת'
                    }
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewProduct(product.productId)}
                      sx={{ flex: 1 }}
                    >
                      פרטים
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CartIcon />}
                      onClick={() => handleAddToCart(product)}
                      sx={{ flex: 1 }}
                    >
                      הוסף לעגלה
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* הודעה קובצת */}
      <CartSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        productName={addedProduct?.productName}
        quantity={1}
      />
    </Container>
  );
};

export default Products;
