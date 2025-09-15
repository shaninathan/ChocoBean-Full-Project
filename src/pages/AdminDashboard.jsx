import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  People as UsersIcon,
  ShoppingCart as OrdersIcon,
  Store as ProductsIcon,
  TrendingUp as StatsIcon,
  AdminPanelSettings as AdminIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { refreshAdminStatus } from '../store/slices/userSlice';
import { fetchAllOrders } from '../store/slices/ordersSlice';
import { fetchAllUsers } from '../store/slices/userSlice';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAdmin, allUsers } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    activeUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // טעינת נתונים לסטטיסטיקות
    dispatch(fetchAllUsers());
    dispatch(fetchAllOrders());
  }, [isAdmin, navigate, dispatch]);

  useEffect(() => {
    // חישוב סטטיסטיקות
    const totalUsers = allUsers.length;
    const totalOrders = orders.length;
    const activeUsers = allUsers.filter(u => u.status === 'Active').length;
    const pendingOrders = orders.filter(o => o.status === 'התקבל' || o.status === 'בטיפול').length;
    const completedOrders = orders.filter(o => o.status === 'הושלם').length;
    
    setStats({
      totalUsers,
      totalOrders,
      activeUsers,
      pendingOrders,
      completedOrders,
    });
  }, [allUsers, orders]);

  if (!isAdmin) {
    return null;
  }

  const adminCards = [
    {
      title: 'ניהול משתמשים',
      description: 'צפייה, עריכה ומחיקה של משתמשים',
      icon: <UsersIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/admin/users',
      color: 'primary.main',
      features: ['צפייה בפרטי משתמשים', 'עדכון סיסמאות', 'מחיקת משתמשים', 'סטטוס משתמשים'],
    },
    {
      title: 'ניהול הזמנות',
      description: 'מעקב ועדכון סטטוס הזמנות',
      icon: <OrdersIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      path: '/admin/orders',
      color: 'secondary.main',
      features: ['עדכון סטטוס הזמנות', 'מחיקת הזמנות', 'צפייה בפרטי הזמנות', 'מעקב הזמנות'],
    },
    {
      title: 'ניהול מוצרים',
      description: 'הוספה ועריכה של מוצרים וקטגוריות',
      icon: <ProductsIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      path: '/admin/products',
      color: 'success.main',
      features: ['הוספת מוצרים חדשים', 'עריכת מוצרים קיימים', 'מחיקת מוצרים', 'ניהול קטגוריות'],
    },
    {
      title: 'סטטיסטיקות',
      description: 'דוחות ומספרים על המערכת',
      icon: <StatsIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      path: '/admin/stats',
      color: 'info.main',
      features: ['דוחות מכירות', 'סטטיסטיקות משתמשים', 'ניתוח הזמנות', 'מעקב ביצועים'],
    },
  ];

  const quickActions = [
    {
      title: 'הוסף מוצר חדש',
      icon: <AddIcon />,
      action: () => navigate('/admin/products/add'),
      color: 'success',
    },
    {
      title: 'עדכן הזמנות',
      icon: <EditIcon />,
      action: () => navigate('/admin/orders'),
      color: 'primary',
    },
    {
      title: 'נהל משתמשים',
      icon: <UsersIcon />,
      action: () => navigate('/admin/users'),
      color: 'secondary',
    },
  ];

  return (
    <Container maxWidth="xl">
      {/* כותרת הדף */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AdminIcon sx={{ fontSize: 50, color: 'primary.main', mr: 2 }} />
          <Typography
            variant={isMobile ? 'h4' : 'h2'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            לוח בקרה - ניהול מערכת
          </Typography>
        </Box>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          ברוך הבא, {user?.userName}! כאן תוכל לנהל את כל המערכת
        </Typography>
        
        {/* סטטוס אדמין */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={isAdmin ? '✅ אדמין פעיל' : '❌ לא אדמין'} 
            color={isAdmin ? 'success' : 'error'}
            icon={<SecurityIcon />}
          />
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => dispatch(refreshAdminStatus())}
          >
            רענן סטטוס
          </Button>
        </Box>
      </Box>

      {/* סטטיסטיקות מהירות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {stats.totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              משתמשים סה"כ
            </Typography>
          </Card>
        </Grid>
        {/* כרטיס משתמשים פעילים הוסר לפי בקשה */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 'bold' }}>
              {stats.totalOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              הזמנות סה"כ
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {stats.pendingOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              הזמנות ממתינות
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
              {stats.completedOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              הזמנות הושלמו
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* פעולות מהירות */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          פעולות מהירות
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Button
                fullWidth
                variant="contained"
                color={action.color}
                startIcon={action.icon}
                onClick={action.action}
                sx={{ py: 1.5 }}
              >
                {action.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* כרטיסי ניהול */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        ניהול המערכת
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {adminCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'right' }}>
                  {card.features.map((feature, idx) => (
                    <Typography key={idx} variant="caption" display="block" color="text.secondary">
                      • {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* מידע נוסף */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          מידע על המערכת
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                🔐 אבטחה מלאה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                כל הפעולות מאובטחות עם JWT tokens ובדיקות הרשאות
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <StatsIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                📊 מעקב מלא
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מעקב על כל הפעולות במערכת עם סטטיסטיקות מפורטות
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <EmailIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
                📧 ניהול משתמשים
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ניהול מלא של משתמשים, הזמנות ופרטי קשר
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;