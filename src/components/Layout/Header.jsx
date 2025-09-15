import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactSupport as ContactIcon,
  Store as StoreIcon,
  Verified as VerifiedIcon,
  AdminPanelSettings as AdminIcon,
  People as UsersIcon,
  ShoppingCart as OrdersIcon,
  Store as ProductsIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const navigationItems = [
    { text: 'דף הבית', path: '/', icon: <HomeIcon /> },
    { text: 'מוצרים', path: '/products', icon: <StoreIcon /> },
    { text: 'אודות', path: '/about', icon: <InfoIcon /> },
    { text: 'צור קשר', path: '/contact', icon: <ContactIcon /> },
  ];

  // תפריט אדמין - רק למשתמשים אדמין
  const adminItems = [
    { text: 'ניהול מערכת', path: '/admin', icon: <VerifiedIcon /> },
    { text: 'ניהול משתמשים', path: '/admin/users', icon: <PersonIcon /> },
    { text: 'ניהול הזמנות', path: '/admin/orders', icon: <CartIcon /> },
    { text: 'ניהול מוצרים', path: '/admin/products', icon: <StoreIcon /> },
  ];
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
    navigate('/');
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };
  
  const isActiveRoute = (path) => location.pathname === path;
  
  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" color="primary" align="center">
          Choco Bean
        </Typography>
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.06)' }}>
            <VerifiedIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">כשר בד''ץ רובין</Typography>
          </Box>
        </Box>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActiveRoute(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(139, 69, 19, 0.12)',
                },
              }}
            >
              <Box sx={{ ml: 2, color: 'primary.main' }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* תפריט אדמין - רק למשתמשים אדמין */}
        {isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemText 
                primary={
                  <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 'bold', px: 2, py: 1 }}>
                    ניהול מערכת
                  </Typography>
                } 
              />
            </ListItem>
            {adminItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActiveRoute(item.path)}
                  sx={{
                    pl: 4,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(156, 39, 176, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ ml: 2, color: 'secondary.main' }}>
                    {item.icon}
                  </Box>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Box>
  );
  
  return (
    <>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          top: 0,
          background: isAdmin 
            ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' 
            : 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
          borderBottom: isAdmin ? '2px solid #3498db' : '2px solid #8b4513'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ gap: 1, px: { xs: 1, sm: 2 }, minHeight: { xs: '56px', md: '64px' }, py: { xs: 0.5, md: 1 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', width: '100%' }}>
              {/* Right region: logo + kosher or burger on mobile */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                {isMobile ? (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ color: 'white' }}
                  >
                    <MenuIcon />
                  </IconButton>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        fontSize: { xs: '1rem', md: '1.2rem' }, 
                        color: 'white',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                      onClick={() => navigate('/')}
                    >
                      {isAdmin ? 'Choco Bean Admin' : 'Choco Bean'}
                    </Typography>
                    {!isAdmin && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                        <VerifiedIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>כשר בד''ץ רובין</Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              {/* Center region: navigation centered - רק למשתמשים רגילים */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                {!isAdmin && navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    variant="text"
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      color: 'white',
                      fontWeight: 700,
                      backgroundColor: 'transparent',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                      textDecoration: isActiveRoute(item.path) ? 'underline' : 'none',
                      textUnderlineOffset: '3px',
                      fontSize: '0.9rem',
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              {/* Left region: login then cart */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                {isAuthenticated ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isAdmin && (
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {user?.userName}
                        </Typography>
                      )}
                      <IconButton color="inherit" onClick={handleUserMenuOpen}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: isAdmin ? '#3498db' : 'secondary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </IconButton>
                    </Box>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleUserMenuClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                      {!isAdmin && <MenuItem onClick={() => { handleNavigation('/profile'); handleUserMenuClose(); }}>הפרופיל שלי</MenuItem>}
                      {!isAdmin && <MenuItem onClick={() => { handleNavigation('/messages'); handleUserMenuClose(); }}>ההודעות שלי</MenuItem>}
                      {!isAdmin && <MenuItem onClick={() => { handleNavigation('/orders'); handleUserMenuClose(); }}>ההזמנות שלי</MenuItem>}
                      <MenuItem onClick={handleLogout}>התנתק</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button 
                    color="inherit" 
                    variant="outlined" 
                    onClick={() => navigate('/login')} 
                    sx={{ 
                      borderRadius: 999, 
                      px: 2, 
                      py: 0.5, 
                      fontSize: '0.9rem',
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    התחבר
                  </Button>
                )}
                {!isAdmin && (
                  <IconButton
                    color="inherit"
                    onClick={() => navigate('/cart')}
                    sx={{ position: 'relative', padding: 0.5 }}
                  >
                    <Badge badgeContent={cartItemsCount} color="secondary">
                      <CartIcon sx={{ fontSize: 20 }} />
                    </Badge>
                  </IconButton>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>
        <div className="header-gradient-bar" />
      </AppBar>

      {/* כפתורי ניהול לאדמין */}
      {isAdmin && (
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: 0,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderBottom: '1px solid #dee2e6'
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              py: 1,
              gap: { xs: 1, md: 2 }
            }}>
              {[
                { text: 'לוח בקרה', path: '/admin', icon: <AdminIcon /> },
                { text: 'ניהול משתמשים', path: '/admin/users', icon: <UsersIcon /> },
                { text: 'ניהול הזמנות', path: '/admin/orders', icon: <OrdersIcon /> },
                { text: 'ניהול מוצרים', path: '/admin/products', icon: <ProductsIcon /> },
                { text: 'הודעות', path: '/admin/messages', icon: <MessageIcon /> },
              ].map((item) => (
                <Button
                  key={item.text}
                  variant={location.pathname === item.path ? "contained" : "outlined"}
                  size={isMobile ? "small" : "medium"}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 0.5, md: 1 },
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    minWidth: { xs: 'auto', md: '140px' },
                    ...(location.pathname === item.path ? {
                      backgroundColor: '#2c3e50',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#34495e',
                      }
                    } : {
                      color: '#2c3e50',
                      borderColor: '#2c3e50',
                      '&:hover': {
                        backgroundColor: '#2c3e50',
                        color: 'white',
                        borderColor: '#2c3e50',
                      }
                    })
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          </Container>
        </Paper>
      )}

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
