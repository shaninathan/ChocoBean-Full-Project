import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#FEF9F0',
        color: 'primary.dark',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid rgba(139, 69, 19, 0.18)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* מידע על החברה */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Choco Bean
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              חנות הקפה והשוקולד המובילה בישראל. 
              אנו מתמחים במוצרי קפה איכותיים, שוקולדים מעולים ומארזי מתנה ייחודיים.
            </Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: 1, bgcolor: 'rgba(139, 69, 19, 0.06)', mb: 2 }}>
              <Typography variant="caption">כשר בד''ץ רובין</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* קישורים מהירים */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              קישורים מהירים
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                דף הבית
              </Link>
              <Link href="/products" color="inherit" sx={{ textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                מוצרים
              </Link>
              <Link href="/about" color="inherit" sx={{ textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                אודות
              </Link>
              <Link href="/contact" color="inherit" sx={{ textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                צור קשר
              </Link>
            </Box>
          </Grid>

          {/* פרטי התקשרות */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              פרטי התקשרות
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  03-1234567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  info@chocobean.co.il
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  רחוב הרצל 123, תל אביב
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(139, 69, 19, 0.12)' }} />

        {/* זכויות יוצרים */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Choco Bean. כל הזכויות שמורות.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
