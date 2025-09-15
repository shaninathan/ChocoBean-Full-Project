import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/productsSlice';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { categories, loading } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  const heroSection = (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #DCC1A9 0%, #C99B74 45%, #B07A54 100%)',
        color: '#FFFFFF',
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        borderRadius: 4,
        textAlign: 'center',
        mb: 6,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 10px 30px rgba(139,69,19,0.25)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("/public/לוגו.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant={isMobile ? 'h3' : 'h1'}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 3,
            color: '#FFFFFF'
          }}
        >
          ברוכים הבאים ל-Choco Bean
        </Typography>
        <Typography
          variant={isMobile ? 'h6' : 'h4'}
          component="p"
          sx={{
            mb: 4,
            opacity: 0.95,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.9)'
          }}
        >
          גלו עולם של טעמים מדהימים עם הקפה והשוקולד האיכותיים שלנו
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              color: '#8B4513',
              background: 'linear-gradient(145deg, #FFF3DA 0%, #FFE5B4 100%)',
              boxShadow: '0 4px 12px rgba(139, 69, 19, 0.18)',
              '&:hover': {
                background: 'linear-gradient(145deg, #FFEAC2 0%, #FFDFA6 100%)',
                boxShadow: '0 6px 18px rgba(139, 69, 19, 0.24)'
              },
            }}
          >
            למוצרים שלנו
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/about')}
            sx={{
              color: '#8B4513',
              background: 'linear-gradient(145deg, #FFF3DA 0%, #FFE5B4 100%)',
              boxShadow: '0 4px 12px rgba(139, 69, 19, 0.18)',
              '&:hover': {
                background: 'linear-gradient(145deg, #FFEAC2 0%, #FFDFA6 100%)',
                boxShadow: '0 6px 18px rgba(139, 69, 19, 0.24)'
              },
            }}
          >
            למידע נוסף
          </Button>
        </Box>
      </Box>
    </Box>
  );
  
  const categorySection = (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 4,
        }}
      >
        קטגוריות מוצרים
      </Typography>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            טוען קטגוריות...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.categoryId}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
                onClick={() => navigate(`/products?category=${category.categoryId}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="/לוגו.jpg"
                  alt={category.categoryName}
                  sx={{
                    objectFit: 'cover',
                    backgroundColor: '#F3E4D4',
                  }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {category.categoryName}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products?category=${category.categoryId}`);
                    }}
                  >
                    צפה במוצרים
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
  
  const featuresSection = (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 4,
        }}
      >
        למה לבחור בנו?
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              height: '100% ',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Typography variant="h4" color="white">
                ☕
              </Typography>
            </Box>
            <Typography variant="h6" component="h3" gutterBottom>
              איכות מעולה
            </Typography>
            <Typography variant="body1" color="text.secondary">
              אנו בוחרים רק את החומרים הטובים ביותר עבור המוצרים שלנו
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              height: '100% ',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Typography variant="h4" color="white">
                🚚
              </Typography>
            </Box>
            <Typography variant="h6" component="h3" gutterBottom>
              משלוח מהיר
            </Typography>
            <Typography variant="body1" color="text.secondary">
              משלוח מהיר ואמין לכל רחבי הארץ
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              height: '100% ',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Typography variant="h4" color="white">
                💝
              </Typography>
            </Box>
            <Typography variant="h6" component="h3" gutterBottom>
              שירות לקוחות
            </Typography>
            <Typography variant="body1" color="text.secondary">
              צוות שירות לקוחות מקצועי וזמין עבורך
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
  
  return (
    <Container maxWidth="xl">
      {heroSection}
      {categorySection}
      {featuresSection}
    </Container>
  );
};

export default Home;
