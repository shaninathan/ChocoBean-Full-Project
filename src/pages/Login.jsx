import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Link,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/userSlice';

// סכמת ולידציה
const schema = yup.object({
  email: yup
    .string()
    .email('כתובת אימייל לא תקינה')
    .required('כתובת אימייל היא שדה חובה'),
  password: yup
    .string()
    .min(6, 'סיסמה חייבת להכיל לפחות 6 תווים')
    .required('סיסמה היא שדה חובה'),
}).required();

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, isAuthenticated, isAdmin } = useSelector((state) => state.user);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  useEffect(() => {
    if (isAuthenticated) {
      // אם זה אדמין, לך לדשבורד האדמין
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, isAdmin, navigate, dispatch]);
  
  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      // הניתוב יתבצע ב-useEffect לפי סטטוס האדמין
    } catch (error) {
      // השגיאה מטופלת ב-Redux
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            width: '100%',
            borderRadius: 3,
          }}
        >
          {/* כותרת */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              התחברות
            </Typography>
            <Typography variant="h6" color="text.secondary">
              ברוכים השבים! התחבר לחשבון שלך
            </Typography>
          </Box>
          
          {/* הודעת שגיאה */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* טופס התחברות */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email')}
              fullWidth
              label="כתובת אימייל"
              type="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
              sx={{ mb: 2 }}
            />
            
            <TextField
              {...register('password')}
              fullWidth
              label="סיסמה"
              type="password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'התחבר'
              )}
            </Button>
          </Box>
          
          {/* קישורים נוספים */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              אין לך חשבון?{' '}
              <Link
                component={RouterLink}
                to="/register"
                color="primary"
                sx={{ textDecoration: 'none', fontWeight: 'bold' }}
              >
                הירשם עכשיו
              </Link>
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              <Link
                component={RouterLink}
                to="/forgot-password"
                color="primary"
                sx={{ textDecoration: 'none' }}
              >
                שכחת סיסמה?
              </Link>
            </Typography>
          </Box>
          
          {/* מידע נוסף */}
          <Box sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, #F0E2D2 0%, #F8EFE4 100%)', borderRadius: 2, border: '1px solid rgba(139,69,19,0.25)' }}>
            <Typography variant="body2" align="center" color="primary.dark" gutterBottom>
              💳 תשלום מאובטח
            </Typography>
            <Typography variant="body2" align="center" color="primary.dark" gutterBottom>
              🚚 משלוח מהיר לכל הארץ
            </Typography>
            <Typography variant="body2" align="center" color="primary.dark">
              💝 אחריות מלאה על כל המוצרים
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
