import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Message as MessageIcon,
  Send as SendIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  MarkEmailRead as ReadIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7036/api';

const AdminMessages = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAdmin } = useSelector((state) => state.user);
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyDialog, setReplyDialog] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [viewDialog, setViewDialog] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    fetchMessages();
  }, [isAdmin, navigate]);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('שגיאה בטעינת הודעות:', error);
      setError(error.response?.data?.message || 'שגיאה בטעינת הודעות');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setViewDialog(true);
    if (!message.isRead) {
      try {
        await axios.put(`${API_BASE_URL}/messages/${message.messageId}/read`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // עדכון ההודעה ברשימה
        setMessages(prev => prev.map(msg => 
          msg.messageId === message.messageId 
            ? { ...msg, isRead: true }
            : msg
        ));
      } catch (error) {
        console.error('שגיאה בסימון הודעה כנקראה:', error);
      }
    }
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyContent('');
    setReplyDialog(true);
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    
    try {
      await axios.post(`${API_BASE_URL}/messages`, {
        fromUserId: 5, // ID של האדמין
        toUserId: selectedMessage.fromUserId,
        subject: `Re: ${selectedMessage.subject}`,
        content: replyContent.trim()
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setReplyDialog(false);
      setReplyContent('');
      setSelectedMessage(null);
      
      // רענון רשימת ההודעות
      fetchMessages();
    } catch (error) {
      console.error('שגיאה בשליחת תשובה:', error);
      setError(error.response?.data?.message || 'שגיאה בשליחת התשובה');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק הודעה זו?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessages(prev => prev.filter(msg => (msg.messageId ?? msg.id) !== messageId));
    } catch (error) {
      console.error('שגיאה במחיקת הודעה:', error?.response || error);
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message || error?.response?.data || '';
      if (status === 404) {
        setError('הודעה לא נמצאה (404). ייתכן שכבר נמחקה.');
        // מסנכרן את הרשימה מקומית ליתר ביטחון
        setMessages(prev => prev.filter(msg => (msg.messageId ?? msg.id) !== messageId));
      } else if (status === 401) {
        setError('אין הרשאה למחיקת הודעה (401). התחבר/י מחדש.');
      } else if (status === 403) {
        setError('אין לך הרשאות למחיקת הודעה זו (403).');
      } else {
        setError(serverMessage || 'שגיאה במחיקת הודעה');
      }
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

  if (!isAdmin) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      {/* כותרת הדף */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <MessageIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            הודעות מהמשתמשים
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          ניהול הודעות ותמיכה למשתמשים
        </Typography>
      </Box>

      {/* הודעת שגיאה */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* רשימת הודעות */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              טוען הודעות...
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              אין הודעות חדשות
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={message.messageId}>
                <ListItem
                  sx={{
                    backgroundColor: message.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: message.isRead ? 'normal' : 'bold' }}
                        >
                          {message.subject}
                        </Typography>
                        {message.subject.startsWith('[משתמש לא קיים]') && (
                          <Chip 
                            label="משתמש לא קיים" 
                            size="small" 
                            color="warning" 
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                        {!message.isRead && (
                          <Chip label="חדש" size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {message.content.length > 100 
                            ? `${message.content.substring(0, 100)}...` 
                            : message.content
                          }
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(message.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ReadIcon />}
                        onClick={() => handleViewMessage(message)}
                        sx={{ minWidth: 'auto' }}
                      >
                        צפה
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ReplyIcon />}
                        onClick={() => handleReply(message)}
                        sx={{ minWidth: 'auto' }}
                      >
                        השב
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteMessage(message.messageId)}
                        title="מחק"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* דיאלוג תשובה */}
      <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>השב להודעה</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            נושא: {selectedMessage?.subject}
          </Typography>
          
          {selectedMessage?.subject.startsWith('[משתמש לא קיים]') && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                ⚠️ הודעה ממשתמש לא קיים - יש לענות במייל או בטלפון!
              </Typography>
              <Typography variant="body2">
                המשתמש לא רשום במערכת. התשובה לא תופיע בפרופיל שלו.
              </Typography>
            </Alert>
          )}
          
          <TextField
            label="תשובתך"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)}>ביטול</Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!replyContent.trim()}
          >
            שלח תשובה
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג צפייה בהודעה */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">
              {selectedMessage?.subject}
            </Typography>
            {selectedMessage?.subject.startsWith('[משתמש לא קיים]') && (
              <Chip 
                label="משתמש לא קיים" 
                size="small" 
                color="warning" 
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            תאריך: {formatDate(selectedMessage?.createdAt)}
          </Typography>
          
          {selectedMessage?.subject.startsWith('[משתמש לא קיים]') && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                ⚠️ הודעה ממשתמש לא קיים - יש לענות במייל או בטלפון!
              </Typography>
            </Alert>
          )}
          
          <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {selectedMessage?.content}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>סגור</Button>
          <Button 
            onClick={() => {
              setViewDialog(false);
              handleReply(selectedMessage);
            }}
            variant="contained"
            startIcon={<ReplyIcon />}
          >
            השב להודעה
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMessages;
