import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7036/api';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState }) => {
    const token = getState().user.token;
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return data;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const response = await axios.get(`${API_BASE_URL}/orders/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return data;
    } catch (error) {
      
      if (error.response?.status === 500) {
        return rejectWithValue('שגיאה בשרת - הזמנות לא זמינות כרגע. אנא נסה שוב מאוחר יותר.');
      }
      
      if (error.response?.status === 404) {
        return rejectWithValue('לא נמצאו הזמנות עבור המשתמש.');
      }
      
      if (error.response?.status === 401) {
        return rejectWithValue('אין הרשאה לצפייה בהזמנות. אנא התחבר מחדש.');
      }
      
      // תעדוף ProblemDetails מהשרת: title כהודעה ידידותית
      const pd = error.response?.data;
      const friendly = pd?.title || pd?.message;
      return rejectWithValue(friendly || 'שגיאה בטעינת ההזמנות');
    }
  }
);

// נדרש שינוי צד שרת? אם יש endpoint Admin להחזרת כל ההזמנות, נשתמש בו,
// אחרת נשתמש ב-/orders/mine עד לעדכון השרת.
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      // אם ה־API קיים: /api/Orders (GET) לכל ההזמנות
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return data;
    } catch (error) {
      
      if (error.response?.status === 500) {
        return rejectWithValue('שגיאה בשרת - לא ניתן לטעון הזמנות כרגע. אנא נסה שוב מאוחר יותר.');
      }
      
      if (error.response?.status === 403) {
        return rejectWithValue('אין הרשאה לצפייה בכל ההזמנות. נדרשת הרשאת אדמין.');
      }
      
      if (error.response?.status === 401) {
        return rejectWithValue('אין הרשאה. אנא התחבר מחדש.');
      }
      
      const pd = error.response?.data;
      const friendly = pd?.title || pd?.message;
      return rejectWithValue(friendly || 'שגיאה בטעינת ההזמנות');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, { getState }) => {
    const token = getState().user.token;
    // השרת מצפה למחרוזת פשוטה בגוף הבקשה ([FromBody] string)
    const response = await axios.put(
      `${API_BASE_URL}/orders/${orderId}/status`,
      JSON.stringify(status),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return data;
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { getState }) => {
    const token = getState().user.token;
    await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return orderId;
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.orderId !== action.payload);
        if (state.currentOrder?.orderId === action.payload) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.orders.findIndex(o => o.orderId === updated.orderId);
        if (idx !== -1) {
          const existing = state.orders[idx] || {};
          state.orders[idx] = {
            ...existing,
            ...updated,
            // שמור items קיימים אם השרת לא החזיר מוצרים
            items: (updated && Array.isArray(updated.items) && updated.items.length > 0)
              ? updated.items
              : existing.items,
          };
        }
      });
  },
});

export const { clearCurrentOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
