import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  People as UsersIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  ShoppingCart as OrdersIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers, updateUserStatus, adminDeleteUser, fetchUserProfileByIdAdmin } from '../store/slices/userSlice';
import { fetchAllOrders } from '../store/slices/ordersSlice';

const AdminUsers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAdmin } = useSelector((state) => state.user);
  const { allUsers, allUsersLoading, allUsersError, adminProfiles } = useSelector((state) => state.user);
  const totalOrders = useSelector((state) => Array.isArray(state.orders?.orders) ? state.orders.orders.length : 0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // טעינת כל המשתמשים מהשרת
    dispatch(fetchAllUsers());
    // טעינת כלל ההזמנות כדי להציג ספירת הזמנות (מטבלת ההזמנות)
    dispatch(fetchAllOrders());
  }, [isAdmin, navigate, dispatch]);

  if (!isAdmin) {
    return null;
  }

  const handleViewUser = (user) => {
    setSelectedUser(user);
    dispatch(fetchUserProfileByIdAdmin(user.id));
    setViewDialogOpen(true);
    // טעינת הזמנות המשתמש
    const userOrdersList = orders.filter(order => order.userId === user.id);
    setUserOrders(userOrdersList);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setPasswordDialogOpen(true);
    setNewPassword('');
  };

  const handleStatusChange = (userId, newStatus) => {
    dispatch(updateUserStatus({ userId, status: newStatus }));
  };

  const confirmPasswordChange = () => {
    if (selectedUser && newPassword) {
      // כאן תהיה קריאה ל-API לעדכון הסיסמה
      setPasswordDialogOpen(false);
      setSelectedUser(null);
      setNewPassword('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'פעיל':
        return 'success';
      case 'לא פעיל':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAdminColor = (isAdmin) => {
    return isAdmin ? 'secondary' : 'default';
  };

  return (
    <Container maxWidth="lg">
      {/* כותרת הדף */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <UsersIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            ניהול משתמשים
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          צפייה ועריכה של כל המשתמשים במערכת | סה"כ הזמנות: {totalOrders}
        </Typography>
      </Box>

      {/* הצגת שגיאות */}
      {allUsersError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          שגיאה בטעינת משתמשים: {allUsersError}
        </Alert>
      )}

      {/* סטטיסטיקות הוסרו לפי בקשה */}

      {/* טבלת משתמשים */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>משתמש</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>אימייל</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>סטטוס</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>הזמנות</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>תאריך הצטרפות</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsersLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>טוען משתמשים...</Typography>
                  </TableCell>
                </TableRow>
              ) : allUsersError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="error">שגיאה בטעינת משתמשים: {allUsersError}</Typography>
                  </TableCell>
                </TableRow>
              ) : allUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>אין משתמשים במערכת</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                allUsers.map((user) => (
                  <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: user.isAdmin ? 'secondary.main' : 'primary.main' }}>
                        {user.userName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {user.userName}
                        </Typography>
                        {user.isAdmin && (
                          <Chip 
                            label="אדמין" 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={getStatusColor(user.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {user.ordersCount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {user.CreatedAt ? new Date(user.CreatedAt).toLocaleDateString('he-IL') : 
                     user.createdAt ? new Date(user.createdAt).toLocaleDateString('he-IL') :
                     user.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') :
                     'לא זמין'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewUser(user)}
                      >
                        צפייה
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditUser(user)}
                      >
                        עריכה
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<SecurityIcon />}
                        onClick={() => handleChangePassword(user)}
                      >
                        סיסמה
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteUser(user)}
                      >
                        מחיקה
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* דיאלוג צפייה במשתמש */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>פרטי משתמש</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">שם משתמש:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{selectedUser.userName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">אימייל:</Typography>
                  <Typography variant="body1">{selectedUser.email}</Typography>
                </Grid>
                {/* פרופיל מהשרת לפי מזהה */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">שם פרטי:</Typography>
                  <Typography variant="body1">{adminProfiles[selectedUser.id]?.firstName || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">שם משפחה:</Typography>
                  <Typography variant="body1">{adminProfiles[selectedUser.id]?.lastName || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">טלפון:</Typography>
                  <Typography variant="body1">{adminProfiles[selectedUser.id]?.phone || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">עיר:</Typography>
                  <Typography variant="body1">{adminProfiles[selectedUser.id]?.city || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">כתובת:</Typography>
                  <Typography variant="body1">{adminProfiles[selectedUser.id]?.address || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">סטטוס:</Typography>
                  <Chip 
                    label={selectedUser.status} 
                    color={getStatusColor(selectedUser.status)} 
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">הזמנות:</Typography>
                  <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {selectedUser.ordersCount}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    הזמנות אחרונות:
                  </Typography>
                  {userOrders.length > 0 ? (
                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                      {userOrders.slice(0, 5).map((order) => (
                        <Box key={order.orderId} sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            הזמנה #{order.orderId} - {order.status} - ₪{order.totalAmount}
                          </Typography>
                        </Box>
                      ))}
                      {userOrders.length > 5 && (
                        <Typography variant="caption" color="text.secondary">
                          ועוד {userOrders.length - 5} הזמנות...
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      אין הזמנות
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">תאריך הצטרפות:</Typography>
                  <Typography variant="body1">
                    {selectedUser.CreatedAt ? new Date(selectedUser.CreatedAt).toLocaleDateString('he-IL') :
                     selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('he-IL') :
                     selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('he-IL') :
                     'לא זמין'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">התחברות אחרונה:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedUser.lastLogin).toLocaleDateString('he-IL')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>סגור</Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג עריכת משתמש */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>עריכת משתמש</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            פונקציונליות עריכת משתמש תתווסף בהמשך
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>סגור</Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג עדכון סיסמה */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>עדכון סיסמה</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            עדכון סיסמה עבור המשתמש: {selectedUser?.userName}
          </Alert>
          
          <TextField
            fullWidth
            label="סיסמה חדשה"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            helperText="הסיסמה חייבת להכיל לפחות 6 תווים"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>ביטול</Button>
          <Button 
            variant="contained" 
            onClick={confirmPasswordChange}
            disabled={!newPassword || newPassword.length < 6}
          >
            עדכן סיסמה
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג מחיקת משתמש */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>מחיקת משתמש</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            האם אתה בטוח שברצונך למחוק את המשתמש "{selectedUser?.userName}"?
            פעולה זו אינה הפיכה.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
          <Button color="error" variant="contained" onClick={() => {
            if (selectedUser) {
              dispatch(adminDeleteUser(selectedUser.id));
            }
            setDeleteDialogOpen(false);
          }}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsers;
