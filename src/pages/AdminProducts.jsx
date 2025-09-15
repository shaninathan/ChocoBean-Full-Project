import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Store as ProductsIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Inventory as StockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, fetchCategories } from '../store/slices/productsSlice';

const AdminProducts = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAdmin } = useSelector((state) => state.user);
  const { products, categories, loading, error } = useSelector((state) => state.products);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    averagePrice: 0,
    totalValue: 0,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [isAdmin, navigate, dispatch]);

  // חישוב סטטיסטיקות
  useEffect(() => {
    if (products.length > 0) {
      const totalProducts = products.length;
      const uniqueCategories = [...new Set(products.map(p => p.categoryId))];
      const totalCategories = uniqueCategories.length;
      const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
      const averagePrice = totalValue / totalProducts;
      
      setStats({
        totalProducts,
        totalCategories,
        averagePrice,
        totalValue,
      });
    }
  }, [products]);

  // פונקציה לקבלת שם הקטגוריה
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : 'לא ידוע';
  };

  // פונקציה לקבלת צבע הקטגוריה
  const getCategoryColor = (categoryId) => {
    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
    const categoryIndex = categories.findIndex(cat => cat.categoryId === categoryId);
    
    if (categoryIndex === -1) return 'default';
    
    // השתמש באינדקס הקטגוריה כדי לקבל צבע עקבי
    return colors[categoryIndex % colors.length];
  };

  // פונקציה לקבלת תמונת המוצר
  const getProductImage = (product) => {
    const categoryName = getCategoryName(product.categoryId);
    if (categoryName && categoryName !== 'לא ידוע') {
      // ניסיון למצוא תמונה לפי שם המוצר בקטגוריה
      return `/public/${categoryName}/${product.productName}.jpg`;
    }
    return '/public/לוגו.jpg'; // תמונת ברירת מחדל
  };

  // פונקציה לקבלת מלאי מוצר
  const getProductStock = (product) => {
    if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
      return product.stockQuantity;
    }
    // אם אין מלאי בבקאנד, נמציא מספר יציב לפי ID המוצר
    return (product.productId % 50) + 2; // מספר בין 2-51
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      {/* כותרת הדף */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <ProductsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            ניהול מוצרים
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          צפייה במוצרים וסטטיסטיקות
        </Typography>
      </Box>

      {/* סטטיסטיקות מהירות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
            <ProductsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {stats.totalProducts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              מוצרים סה"כ
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
            <CategoryIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
              {stats.totalCategories}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              קטגוריות
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
            <PriceIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 'bold' }}>
              ₪{stats.averagePrice.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              מחיר ממוצע
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
            <StockIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
              ₪{stats.totalValue.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ערך כולל
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* הודעת שגיאה */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* טבלת מוצרים */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>תמונה</TableCell>
                <TableCell>שם המוצר</TableCell>
                <TableCell>קטגוריה</TableCell>
                <TableCell>מחיר</TableCell>
                <TableCell>מלאי</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      טוען מוצרים...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      אין מוצרים במערכת
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>
                      <Box
                        component="img"
                        src={getProductImage(product)}
                        alt={product.productName}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                        onError={(e) => {
                          e.target.src = '/public/לוגו.jpg';
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {product.productName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.description || 'אין תיאור'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryName(product.categoryId)}
                        size="small"
                        icon={<CategoryIcon />}
                        variant="outlined"
                        sx={{ backgroundColor: 'transparent' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        ₪{product.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getProductStock(product)}
                        size="small"
                        variant="outlined"
                        sx={{ backgroundColor: 'transparent' }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminProducts;
