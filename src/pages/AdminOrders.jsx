import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  Grid, 
  Divider, 
  Chip, 
  Select, 
  MenuItem, 
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  Person as UserIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '../store/slices/ordersSlice';

const AdminOrders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useSelector((s) => s.user);
  const { orders, loading, error } = useSelector((s) => s.orders);
  const [statusByOrder, setStatusByOrder] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('הכל');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);


  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    
    // טעינת הזמנות מהשרת
    dispatch(fetchAllOrders());
  }, [dispatch, isAuthenticated, isAdmin, navigate]);

  // סינון הזמנות לפי סטטוס וחיפוש
  useEffect(() => {
    let filtered = orders;
    
    // סינון לפי סטטוס
    if (statusFilter !== 'הכל') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // סינון לפי חיפוש
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId?.toString().includes(searchTerm) ||
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const handleChangeStatus = (orderId, newStatus) => {
    setStatusByOrder(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את ההזמנה?')) {
      dispatch(deleteOrder(orderId));
    }
  };

  const handleUpdate = (orderId) => {
    const status = statusByOrder[orderId];
    if (!status) return;
    dispatch(updateOrderStatus({ orderId, status }));
  };

  if (loading && orders.length === 0) {
    return <Container maxWidth="lg"><Typography sx={{ mt: 4 }}>טוען הזמנות...</Typography></Container>;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body1">{error}</Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => dispatch(fetchAllOrders())}
              disabled={loading}
            >
              נסה שוב
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }

  // וידוא שההזמנות קיימות ומערך תקין
  const displayOrders = Array.isArray(orders) ? orders : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'התקבל':
        return 'default';
      case 'בטיפול':
        return 'warning';
      case 'שולם':
        return 'success';
      case 'נשלח':
        return 'info';
      case 'הושלם':
        return 'success';
      case 'בוטל':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      {/* כותרת הדף */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <OrdersIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            ניהול הזמנות
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          צפייה ועדכון סטטוס כל ההזמנות במערכת
        </Typography>
      </Box>

      {/* שדות חיפוש וסינון */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon color="primary" />
              <TextField
                fullWidth
                label="חיפוש הזמנות"
                placeholder="חיפוש לפי שם משתמש, מספר הזמנה או אימייל"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon color="primary" />
              <Select
                fullWidth
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="הכל">הכל</MenuItem>
                <MenuItem value="התקבל">התקבל</MenuItem>
                <MenuItem value="בטיפול">בטיפול</MenuItem>
                <MenuItem value="שולם">שולם</MenuItem>
                <MenuItem value="הושלם">הושלם</MenuItem>
                <MenuItem value="בוטל">בוטל</MenuItem>
              </Select>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" align="center">
              {filteredOrders.length} מתוך {orders.length} הזמנות
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* הצגת שגיאות */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          שגיאה בטעינת הזמנות: {error}
        </Alert>
      )}

      {/* סטטיסטיקות מהירות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {displayOrders.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סה"כ הזמנות
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {displayOrders.filter(o => o.status === 'שולם').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                הזמנות ששולמו
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {displayOrders.filter(o => o.status === 'בהמתנה').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                הזמנות בהמתנה
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                ₪{displayOrders.reduce((sum, o) => sum + o.totalPrice, 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סה"כ הכנסות
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* טבלת הזמנות */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>הזמנה</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>משתמש</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>תאריך</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>סטטוס</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>מוצרים</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>סה"כ</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>טוען הזמנות...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>אין הזמנות במערכת</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  // וידוא שההזמנה תקינה
                  if (!order || typeof order !== 'object') {
                    return null;
                  }
                  
                  return (
                  <TableRow key={order.orderId || `order-${Math.random()}`} hover>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      #{order.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {order.userName ? order.userName.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {order.userName || `משתמש ${order.userId || 'לא ידוע'}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.userEmail || 'אימייל לא זמין'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('he-IL') : 'תאריך לא זמין'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status || 'לא ידוע'} 
                      color={getStatusColor(order.status || '')} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                            {item.productName || 'מוצר לא ידוע'} x{item.quantity || 0}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          אין פרטי מוצרים
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      ₪{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Select 
                        size="small" 
                        value={statusByOrder[order.orderId] || order.status || ''} 
                        onChange={(e) => handleChangeStatus(order.orderId, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="התקבל">התקבל</MenuItem>
                        <MenuItem value="בטיפול">בטיפול</MenuItem>
                        <MenuItem value="שולם">שולם</MenuItem>
                        <MenuItem value="הושלם">הושלם</MenuItem>
                      </Select>
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => handleUpdate(order.orderId)}
                        disabled={!statusByOrder[order.orderId]}
                      >
                        עדכן
                      </Button>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewOrder(order)}
                      >
                        צפייה
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteOrder(order.orderId)}
                      >
                        מחק
                      </Button>
                  </Box>
                  </TableCell>
                </TableRow>
                );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* דיאלוג צפייה בהזמנה */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>פרטי הזמנה #{selectedOrder?.orderId}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">מספר הזמנה:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>#{selectedOrder.orderId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">משתמש:</Typography>
                  <Typography variant="body1">{selectedOrder.userName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">אימייל:</Typography>
                  <Typography variant="body1">{selectedOrder.userEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">סטטוס:</Typography>
                  <Chip 
                    label={selectedOrder.status} 
                    color={getStatusColor(selectedOrder.status)} 
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">תאריך הזמנה:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedOrder.orderDate).toLocaleDateString('he-IL')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">סה"כ:</Typography>
                  <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    ₪{selectedOrder.totalPrice?.toFixed(2) || '0.00'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    מוצרים:
                  </Typography>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {selectedOrder.items.map((item, idx) => (
                        <Box key={idx} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {item.productName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            כמות: {item.quantity} | מחיר: ₪{item.price?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      אין פרטי מוצרים
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>סגור</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrders;
