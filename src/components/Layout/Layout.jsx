import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAdminStatus } from '../../store/slices/userSlice';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.user);

  // Refresh admin status when component mounts or token changes
  useEffect(() => {
    if (token && isAuthenticated) {
      dispatch(refreshAdminStatus());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container 
        component="main" 
        maxWidth="xl" 
        sx={{ 
          flex: 1, 
          py: 4,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
