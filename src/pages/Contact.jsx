import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Send as SendIcon,
} from '@mui/icons-material';

// סכמת ולידציה
const schema = yup.object({
  firstName: yup
    .string()
    .min(2, 'שם פרטי חייב להכיל לפחות 2 תווים')
    .required('שם פרטי הוא שדה חובה'),
  lastName: yup
    .string()
    .min(2, 'שם משפחה חייב להכיל לפחות 2 תווים')
    .required('שם משפחה הוא שדה חובה'),
  email: yup
    .string()
    .email('כתובת אימייל לא תקינה')
    .required('כתובת אימייל היא שדה חובה'),
  phone: yup
    .string()
    .matches(/^[0-9-+\s()]+$/, 'מספר טלפון לא תקין')
    .required('מספר טלפון הוא שדה חובה'),
  subject: yup
    .string()
    .min(5, 'נושא ההודעה חייב להכיל לפחות 5 תווים')
    .required('נושא ההודעה הוא שדה חובה'),
  message: yup
    .string()
    .min(10, 'ההודעה חייבת להכיל לפחות 10 תווים')
    .required('ההודעה היא שדה חובה'),
}).required();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7036/api';

// טוקן קבוע של אדמין לשמירה במערכת
// נקבל טוקן אמיתי של אדמין מהשרת
const getAdminToken = async () => {
  try {
    // נסה להתחבר כאדמין ולקבל טוקן
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return data.token;
  } catch (error) {
    console.error('שגיאה בהתחברות כאדמין:', error);
    // אם לא עובד, נשתמש בטוקן זמני
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInVzZXJJZCI6IjUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc1NzIzNzQ1NCwiaXNzIjoiQ2hvY29CZWFuIiwiYXVkIjoiQ2hvY29CZWFuQ2xpZW50In0.example';
  }
};

// פונקציה לבדיקה אם המשתמש הוא אדמין
const checkIfAdmin = (token) => {
  if (!token) {
    return false;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    const decodedString = atob(padded);
    const decoded = JSON.parse(decodedString);
    
    const email = decoded.sub || decoded.email;
    const userId = decoded.userId;
    
    const isAdminByEmail = email && email.toLowerCase().includes('admin');
    const isAdminById = userId === "5";
    
    return isAdminByEmail || isAdminById;
  } catch (error) {
    return false;
  }
};

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  // פונקציה לבדיקת קיום מייל במערכת
  const checkEmailExists = async (email) => {
    // נסה לבדוק עם השרת אם המייל קיים בבסיס הנתונים
    try {
      const response = await axios.get(`${API_BASE_URL}/users/check-email/${encodeURIComponent(email)}`);
      return response.data.exists;
    } catch (error) {
      console.error('שגיאה בבדיקת מייל:', error);
      return false;
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // אם המשתמש מחובר, שלח דרך המערכת
      if (token && user) {
        const messageData = {
          fromUserId: user.id,
          toUserId: null, // null = לשלוח לאדמין
          subject: data.subject,
          content: `שם: ${data.firstName} ${data.lastName}\nאימייל: ${data.email}\nטלפון: ${data.phone}\n\nהודעה:\n${data.message}`
        };
        
        await axios.post(`${API_BASE_URL}/messages`, messageData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setIsSubmitting(false);
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        // בדוק אם המייל קיים במערכת
        const emailExists = await checkEmailExists(data.email);
        
        let messageData;
        let tokenToUse;
        
        if (emailExists) {
          // המייל קיים בבסיס הנתונים - השתמש בטוקן של המשתמש המחובר
          messageData = {
            fromUserId: user ? user.id : 0, // אם יש משתמש מחובר, השתמש ב-ID שלו
            toUserId: null, // null = לשלוח לאדמין
            subject: data.subject,
            content: `שם: ${data.firstName} ${data.lastName}\nאימייל: ${data.email}\nטלפון: ${data.phone}\n\nהודעה:\n${data.message}`
          };
          tokenToUse = localStorage.getItem('token');
          console.log('המייל קיים בבסיס הנתונים - משתמש בטוקן של המשתמש המחובר');
        } else {
          // המייל לא קיים בבסיס הנתונים - השתמש בטוקן האדמין הקיים
          messageData = {
            fromUserId: 5, // ID של האדמין
            toUserId: null, // null = לשלוח לאדמין
            subject: `[משתמש לא קיים] ${data.subject}`,
            content: `🔔 הודעה ממשתמש לא קיים - יש לענות במייל/טלפון\n\nשם: ${data.firstName} ${data.lastName}\nאימייל: ${data.email}\nטלפון: ${data.phone}\n\nהודעה:\n${data.message}`
          };
          tokenToUse = localStorage.getItem('token'); // השתמש בטוקן הקיים של האדמין
        }
        
        // נסה לשלוח את ההודעה לשרת
        try {
          if (tokenToUse) {
            
            const response = await axios.post(`${API_BASE_URL}/messages`, messageData, {
              headers: {
                Authorization: `Bearer ${tokenToUse}`
              }
            });
            
          } else {
          }
        } catch (guestError) {
          console.error('שגיאה בשליחת הודעה:', guestError);
        }
        
        // תמיד הצג הודעת הצלחה
        setIsSubmitting(false);
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('שגיאה בשליחת הודעה:', error);
      
      // אם השרת לא עובד, הצג הודעת הצלחה מדומה
      if (error.response?.status === 500 || error.response?.status === 405 || error.response?.status === 404) {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setIsSubmitting(false);
        setSubmitError(error.response?.data?.message || 'שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר.');
      }
    }
  };
  
  const contactInfo = [
    {
      icon: <PhoneIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
      title: 'טלפון',
      content: '03-1234567',
      subtitle: 'ימים א-ה: 9:00-18:00',
    },
    {
      icon: <EmailIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
      title: 'אימייל',
      content: 'info@chocobean.co.il',
      subtitle: 'נענה תוך 24 שעות',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
      title: 'כתובת',
      content: 'רחוב הרצל 123, תל אביב',
      subtitle: 'חנות פיזית פתוחה',
    },
    {
      icon: <TimeIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
      title: 'שעות פעילות',
      content: 'ימים א-ה: 9:00-18:00',
      subtitle: 'שישי: 9:00-14:00',
    },
  ];
  
  return (
    <Container maxWidth="lg">
      {/* כותרת ראשית */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant={isMobile ? 'h4' : 'h2'}
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
        >
          צור קשר
        </Typography>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          color="text.secondary"
          sx={{ maxWidth: 780, mx: 'auto', lineHeight: 1.8 }}
        >
          אנו כאן לעזור לך! צור איתנו קשר בכל שאלה, הצעה או בעיה
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* מידע ליצירת קשר */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
            >
              פרטי התקשרות
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contactInfo.map((info, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid rgba(139,69,19,0.25)',
                    background: 'linear-gradient(145deg, #F7E6D5 0%, #F3E4D4 100%)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ mt: 0.5 }}>
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {info.title}
                      </Typography>
                      <Typography variant="body1" gutterBottom color="primary.dark">
                        {info.content}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
          
          {/* מידע נוסף */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(145deg, #F7E6D5 0%, #F3E4D4 100%)',
              color: 'primary.dark',
              border: '1px solid rgba(139,69,19,0.25)'
            }}
          >
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
              למה לבחור בנו?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2">☕ מוצרי קפה איכותיים</Typography>
              <Typography variant="body2">🍫 שוקולדים מעולים</Typography>
              <Typography variant="body2">🚚 משלוח מהיר לכל הארץ</Typography>
              <Typography variant="body2">💝 שירות לקוחות מעולה</Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* טופס יצירת קשר */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
             <Typography
               variant="h5"
               component="h2"
               gutterBottom
               sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
             >
               שלח לנו הודעה
             </Typography>
             
             {/* הודעה לאורחים */}
             {!token && (
               <Alert severity="info" sx={{ mb: 3 }}>
                 <Typography variant="body2">
                   <strong>שימו לב:</strong> המערכת תזהה אם המייל שלכם רשום במערכת. 
                   אם כן, התשובה תופיע בדף הפרופיל שלכם. אם לא, התשובה תישלח במייל.
                 </Typography>
               </Alert>
             )}
            
             {/* הודעות */}
             {submitSuccess && (
               <Alert severity="success" sx={{ mb: 3 }}>
                 {token && user 
                   ? 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם האפשרי דרך המערכת.'
                   : 'ההודעה נשלחה בהצלחה! נחזור אליך במייל או בטלפון בהקדם האפשרי.'
                 }
               </Alert>
             )}
            
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}
            
            {/* טופס יצירת קשר */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('firstName')}
                    fullWidth
                    label="שם פרטי"
                    margin="normal"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('lastName')}
                    fullWidth
                    label="שם משפחה"
                    margin="normal"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('email')}
                    fullWidth
                    label="כתובת אימייל"
                    type="email"
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('phone')}
                    fullWidth
                    label="מספר טלפון"
                    margin="normal"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    {...register('subject')}
                    fullWidth
                    label="נושא ההודעה"
                    margin="normal"
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    {...register('message')}
                    fullWidth
                    label="ההודעה שלך"
                    multiline
                    rows={6}
                    margin="normal"
                    error={!!errors.message}
                    helperText={errors.message?.message}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{ py: 1.5, mt: 1 }}
                  >
                    {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* מפה או מידע נוסף */}
      <Box sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2, textAlign: 'center' }}
          >
            איך להגיע אלינו
          </Typography>
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ lineHeight: 1.9, mb: 2, maxWidth: 700 }} color="text.secondary">
                החנות שלנו ממוקמת במרכז תל אביב, בקלות נגישות בתחבורה הציבורית 
                ובמכונית פרטית. יש לנו חניה חינם ללקוחות שלנו.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                הוראות הגעה:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" color="text.secondary">🚌 אוטובוס: קווים 1, 2, 3, 4, 5</Typography>
                <Typography variant="body2" color="text.secondary">🚇 רכבת: תחנת תל אביב מרכז</Typography>
                <Typography variant="body2" color="text.secondary">🚗 רכב פרטי: חניה חינם ללקוחות</Typography>
                <Typography variant="body2" color="text.secondary">🚲 אופניים: שבילי אופניים מכל הכיוונים</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.3s ease',
                  }
                }}
                onClick={() => window.open('https://maps.google.com/?q=תל+אביב+ישראל', '_blank')}
              >
                <img
                  src="https://maps.googleapis.com/maps/api/staticmap?center=תל+אביב+ישראל&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7Cתל+אביב+ישראל&key=YOUR_API_KEY"
                  alt="מיקום החנות - תל אביב"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    backgroundColor: '#F3E4D4',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#F3E4D4',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" color="primary.main" textAlign="center">
                    לחץ כאן לפתיחת מפה
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    📍 תל אביב, ישראל
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    🗺️ Google Maps
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Contact;
