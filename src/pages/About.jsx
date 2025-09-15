import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Coffee as CoffeeIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const values = [
    { icon: <CoffeeIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'איכות מעולה', description: 'אנו בוחרים רק את החומרים הטובים ביותר עבור המוצרים שלנו, עם דגש על טעם ואיכות.' },
    { icon: <FavoriteIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'אהבה למוצר', description: 'כל מוצר שלנו נוצר באהבה ובמקצועיות, עם תשומת לב לפרטים הקטנים.' },
    { icon: <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'חוויית לקוח', description: 'אנו מתמקדים בחוויית הלקוח ומספקים שירות מעולה בכל שלב.' },
    { icon: <ShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'משלוח מהיר', description: 'משלוח מהיר ואמין לכל רחבי הארץ, עם מעקב מלא על ההזמנה שלך.' },
    { icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'אבטחה מלאה', description: 'הפרטים שלך בטוחים אצלנו עם אבטחה מתקדמת ותשלום מאובטח.' },
    { icon: <SupportIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'תמיכה 24/7', description: 'צוות התמיכה שלנו זמין עבורך בכל שאלה או בעיה.' },
  ];
  
  return (
    <Container maxWidth="lg">
      {/* כותרת ראשית */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant={isMobile ? 'h4' : 'h2'} component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          אודות Choco Bean
        </Typography>
        <Typography variant={isMobile ? 'h6' : 'h5'} color="text.secondary" sx={{ maxWidth: 780, mx: 'auto', lineHeight: 1.8 }}>
          חנות הקפה והשוקולד המובילה בישראל, המתמחה במוצרי קפה איכותיים, שוקולדים מעולים ומארזי מתנה ייחודיים
        </Typography>
      </Box>
      
      {/* סיפור החברה */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mb: 5, borderRadius: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2, textAlign: 'center' }}>
          הסיפור שלנו
        </Typography>
        
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ lineHeight: 1.9, mb: 2 }} color="text.secondary">
              Choco Bean נוסדה בשנת 2020 מתוך אהבה עמוקה לקפה ולשוקולד איכותי. המייסדים שלנו, חובבי קפה מושבעים, הבינו שיש צורך בשוק הישראלי בחנות שתספק מוצרי קפה ושוקולד ברמה הגבוהה ביותר.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.9, mb: 2 }} color="text.secondary">
              התחלנו כחנות קטנה בתל אביב, והתפתחנו לחנות מקוונת מצליחה המשרתת לקוחות מכל רחבי הארץ. אנו מתגאים במבחר הרחב שלנו של מוצרי קפה ושוקולד, כולם נבחרים בקפידה ומגיעים מיצרנים מובילים.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.9 }} color="text.secondary">
              המשימה שלנו היא להביא את הטעמים הטובים ביותר ישירות אליכם, עם שירות לקוחות מעולה ומחירים הוגנים.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              width: '100%', height: 300, backgroundColor: '#F3E4D4', borderRadius: 3,
              backgroundImage: 'url("/public/לוגו.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
            }} />
          </Grid>
        </Grid>
      </Paper>
      
      {/* הערכים שלנו */}
      <Box sx={{ mb: 5 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3, textAlign: 'center' }}>
          הערכים שלנו
        </Typography>
        <Grid container spacing={3}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: theme.shadows[8] } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>{value.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* סטטיסטיקות */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mb: 5, borderRadius: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3, textAlign: 'center' }}>
          מספרים מדברים
        </Typography>
        <Grid container spacing={4} textAlign="center">
          {[
            { num: '10,000+', label: 'לקוחות מרוצים' },
            { num: '500+', label: 'מוצרים איכותיים' },
            { num: '50+', label: 'מותגים מובילים' },
            { num: '24/7', label: 'תמיכה זמינה' },
          ].map((s, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Typography variant="h3" component="div" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {s.num}
              </Typography>
              <Typography variant="h6" color="text.secondary">{s.label}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* צוות החברה */}
      <Box sx={{ mb: 5 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3, textAlign: 'center' }}>
          הצוות שלנו
        </Typography>
        <Grid container spacing={4}>
          {[ '👨‍💼', '👩‍💼', '👨‍🔬' ].map((emoji, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <Typography variant="h3" color="white">{emoji}</Typography>
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {i === 0 ? 'דוד כהן' : i === 1 ? 'שרה לוי' : 'משה גולדברג'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {i === 0 ? 'מנכ"ל ומייסד' : i === 1 ? 'מנהלת שיווק' : 'מנהל איכות'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {i === 0 ? 'חובב קפה מושבע עם ניסיון של 15 שנה בתעשיית הקפה' : i === 1 ? 'מומחית בשיווק דיגיטלי עם תשוקה לשוקולד איכותי' : 'מומחה בטעימות קפה עם תעודה בינלאומית'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* קריאה לפעולה */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', color: 'white' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          מוכנים להתחיל?
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
          הצטרפו למשפחת Choco Bean וגלו עולם של טעמים מדהימים
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          התחילו בקניות עכשיו ותיהנו מהמוצרים האיכותיים שלנו
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
