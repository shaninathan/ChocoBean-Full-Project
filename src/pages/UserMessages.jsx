import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Message as MessageIcon,
  Support as SupportIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7036/api';

const UserMessages = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, token } = useSelector((state) => state.user);
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    
    fetchData();
  }, [user, token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // טען הודעות תמיכה
      const messagesResponse = await axios.get(`${API_BASE_URL}/messages/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessages(messagesResponse.data);


      // ספור הודעות לא נקראות
      const unreadMessages = messagesResponse.data.filter(msg => !msg.isRead);
      setUnreadCount(unreadMessages.length);

    } catch (error) {
      console.error('שגיאה בטעינת נתונים:', error);
      setError(error.response?.data?.message || 'שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`${API_BASE_URL}/messages/${messageId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // עדכון ההודעה ברשימה
      setMessages(prev => prev.map(msg => 
        msg.messageId === messageId 
          ? { ...msg, isRead: true }
          : msg
      ));
      
      // עדכון מונה ההודעות הלא נקראות
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('שגיאה בסימון הודעה כנקראה:', error);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSupportMessages = () => {
    if (messages.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <SupportIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            אין הודעות תמיכה חדשות
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {messages.map((message, index) => (
          <React.Fragment key={message.messageId}>
            <ListItem
              sx={{
                backgroundColor: message.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                cursor: 'pointer'
              }}
              onClick={() => markAsRead(message.messageId)}
            >
              <ListItemIcon>
                {message.fromUserId === user.id ? (
                  <MessageIcon color="primary" />
                ) : (
                  <SupportIcon color="secondary" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="subtitle1"
                      component="span"
                      sx={{ fontWeight: message.isRead ? 'normal' : 'bold' }}
                    >
                      {message.subject}
                    </Typography>
                    {!message.isRead && (
                      <Chip label="חדש" size="small" color="primary" />
                    )}
                    {message.fromUserId !== user.id && (
                      <Chip label="תשובה" size="small" color="secondary" />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" component="span" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      {message.content.length > 100 
                        ? `${message.content.substring(0, 100)}...` 
                        : message.content
                      }
                    </Typography>
                    <Typography variant="caption" component="span" color="text.secondary">
                      {formatDate(message.createdAt)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < messages.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    );
  };


  if (!user || !token) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      {/* כותרת הדף */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <NotificationIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            ההודעות שלי
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          עדכוני הזמנות והודעות תמיכה
        </Typography>
      </Box>

      {/* הודעת שגיאה */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* הודעות תמיכה בלבד */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                טוען הודעות...
              </Typography>
            </Box>
          ) : (
            renderSupportMessages()
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UserMessages;
