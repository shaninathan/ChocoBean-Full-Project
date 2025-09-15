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
import { registerUser, clearError } from '../store/slices/userSlice';

// סכמת ולידציה
const schema = yup.object({
  userName: yup
    .string()
    .min(3, 'שם משתמש חייב להכיל לפחות 3 תווים')
    .max(20, 'שם משתמש לא יכול להכיל יותר מ-20 תווים')
    .required('שם משתמש הוא שדה חובה'),
  email: yup
    .string()
    .email('כתובת אימייל לא תקינה')
    .required('כתובת אימייל היא שדה חובה'),
  password: yup
    .string()
    .min(6, 'סיסמה חייבת להכיל לפחות 6 תווים')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'סיסמה חייבת להכיל אות גדולה, אות קטנה ומספר'
    )
    .required('סיסמה היא שדה חובה'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'הסיסמאות חייבות להיות זהות')
    .required('אימות סיסמה הוא שדה חובה'),
}).required();

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);
  
  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data;
      await dispatch(registerUser(userData)).unwrap();
      navigate('/');
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
              הרשמה
            </Typography>
            <Typography variant="h6" color="text.secondary">
              צור חשבון חדש והתחל בקניות
            </Typography>
          </Box>
          
          {/* הודעת שגיאה */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* טופס הרשמה */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('userName')}
              fullWidth
              label="שם משתמש"
              margin="normal"
              error={!!errors.userName}
              helperText={errors.userName?.message}
              autoComplete="username"
              sx={{ mb: 2 }}
            />
            
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
              autoComplete="new-password"
              sx={{ mb: 3 }}
            />
            
            <TextField
              {...register('confirmPassword')}
              fullWidth
              label="אימות סיסמה"
              type="password"
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              autoComplete="new-password"
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
                'הירשם'
              )}
            </Button>
          </Box>
          
          {/* קישורים נוספים */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              יש לך כבר חשבון?{' '}
              <Link
                component={RouterLink}
                to="/login"
                color="primary"
                sx={{ textDecoration: 'none', fontWeight: 'bold' }}
              >
                התחבר עכשיו
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
            <Typography variant="body2" align="center" color="primary.dark" gutterBottom>
              💝 אחריות מלאה על כל המוצרים
            </Typography>
            <Typography variant="body2" align="center" color="primary.dark">
              🔒 פרטיות מלאה - המידע שלך בטוח אצלנו
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
