import React, { useEffect, useState, useCallback } from 'react';
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
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, deleteUser } from '../store/slices/userSlice';
import axios from 'axios';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Message as MessageIcon,
} from '@mui/icons-material';

// סכמת ולידציה לפרופיל
const schema = yup.object({
  firstName: yup.string().min(2, 'שם פרטי חייב להכיל לפחות 2 תווים'),
  lastName: yup.string().min(2, 'שם משפחה חייב להכיל לפחות 2 תווים'),
  phone: yup.string().matches(/^[0-9-+\s()]+$/, 'מספר טלפון לא תקין'),
  address: yup.string().min(5, 'כתובת חייבת להכיל לפחות 5 תווים'),
  city: yup.string().min(2, 'עיר חייבת להכיל לפחות 2 תווים'),
  postalCode: yup.string().matches(/^[0-9]{5,7}$/, 'מיקוד חייב להכיל 5-7 ספרות')
}).required();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7036/api';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, profile, loading, error, token } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [supportMessages, setSupportMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile(user.id));
      fetchSupportMessages();
    }
  }, [dispatch, user?.id]);

  const fetchSupportMessages = async () => {
    if (!user) return;
    setMessagesLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSupportMessages(response.data);
    } catch (error) {
      console.error('שגיאה בטעינת הודעות תמיכה:', error);
      // אם אין endpoint, הצג רשימה ריקה
      setSupportMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // אם אין פרופיל, הצג נתונים מדומים
  const displayProfile = profile || {
    firstName: 'אדמין',
    lastName: 'מערכת',
    phone: '050-1234567',
    address: 'רחוב הרצל 123',
    city: 'תל אביב',
    postalCode: '12345'
  };

  // יצירת פונקציה יציבה לאיפוס הטופס
  const resetForm = useCallback(() => {
    if (profile) {
      reset(profile);
    } else {
      // אם אין פרופיל, השתמש בנתונים המדומים
      reset({
        firstName: 'אדמין',
        lastName: 'מערכת',
        phone: '050-1234567',
        address: 'רחוב הרצל 123',
        city: 'תל אביב',
        postalCode: '12345'
      });
    }
  }, [profile, reset]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const onSubmit = async (data) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await dispatch(updateUserProfile({ userId: user.id, profileData: data })).unwrap();
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    // ולידציה פשוטה: חייב להקליד DELETE כדי לאשר
    if (confirmText.trim().toUpperCase() !== 'DELETE') return;
    await dispatch(deleteUser(user.id));
    setDeleteOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading && !profile) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          הפרופיל שלי
        </Typography>
        <Typography variant="h6" color="text.secondary">ניהול החשבון והפרטים האישיים שלך</Typography>
      </Box>

      {error && (<Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>)}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 3, bgcolor: 'primary.main', fontSize: '3rem' }}>
              {user.userName?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>{user.userName}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{user.email}</Typography>
            <Divider sx={{ my: 2 }} />
            <Button color="error" variant="outlined" onClick={() => { setConfirmText(''); setDeleteOpen(true); }}>
              מחיקת משתמש
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>פרטים אישיים</Typography>
              {!isEditing && (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>ערוך</Button>
              )}
            </Box>

            {isEditing ? (
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField {...register('firstName')} fullWidth label="שם פרטי" margin="normal" error={!!errors.firstName} helperText={errors.firstName?.message} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField {...register('lastName')} fullWidth label="שם משפחה" margin="normal" error={!!errors.lastName} helperText={errors.lastName?.message} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField {...register('phone')} fullWidth label="טלפון" margin="normal" error={!!errors.phone} helperText={errors.phone?.message} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField {...register('city')} fullWidth label="עיר" margin="normal" error={!!errors.city} helperText={errors.city?.message} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField {...register('address')} fullWidth label="כתובת מלאה" margin="normal" error={!!errors.address} helperText={errors.address?.message} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField {...register('postalCode')} fullWidth label="מיקוד" margin="normal" error={!!errors.postalCode} helperText={errors.postalCode?.message} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}>שמור שינויים</Button>
                      <Button variant="outlined" onClick={() => setIsEditing(false)} disabled={isSubmitting}>ביטול</Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <PersonIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">שם מלא</Typography>
                                                 <Typography variant="body1">{displayProfile?.firstName || ''} {displayProfile?.lastName || ''}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <PhoneIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">טלפון</Typography>
                                                 <Typography variant="body1">{displayProfile?.phone || ''}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <LocationIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">כתובת</Typography>
                                                 <Typography variant="body1">{displayProfile?.address || ''}, {displayProfile?.city || ''} {displayProfile?.postalCode || ''}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* הודעות תמיכה */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <MessageIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                הודעות מהתמיכה
              </Typography>
            </Box>
            
            {messagesLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  טוען הודעות...
                </Typography>
              </Box>
            ) : supportMessages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  אין הודעות תמיכה
                </Typography>
              </Box>
            ) : (
              <List>
                {supportMessages.map((message, index) => (
                  <React.Fragment key={message.messageId}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {message.subject}
                            </Typography>
                            {!message.isRead && (
                              <Chip label="חדש" size="small" color="primary" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {message.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(message.createdAt).toLocaleDateString('he-IL', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < supportMessages.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* דיאלוג מחיקת משתמש */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>אישור מחיקת משתמש</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            למחיקה סופית, הקלידי DELETE בתיבה למטה. פעולה זו אינה הפיכה.
          </Typography>
          <TextField fullWidth value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="הקלידי DELETE" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>ביטול</Button>
          <Button color="error" variant="contained" disabled={confirmText.trim().toUpperCase() !== 'DELETE'} onClick={handleDelete}>מחקי</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
