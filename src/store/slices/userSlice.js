import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7036/api';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';

// Async thunks
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return data;
    } catch (error) {
      // טיפול בשגיאות הרשמה
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.title;
        if (errorMessage?.includes('email') || errorMessage?.includes('אימייל')) {
          return rejectWithValue('כתובת האימייל כבר קיימת במערכת');
        }
        if (errorMessage?.includes('username') || errorMessage?.includes('שם משתמש')) {
          return rejectWithValue('שם המשתמש כבר קיים במערכת');
        }
        return rejectWithValue(errorMessage || 'שגיאה בהרשמה');
      }
      return rejectWithValue('שגיאה בהרשמה - אנא נסה שוב');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return data;
    } catch (error) {
      console.error('שגיאה בהתחברות:', error);
      
      // טיפול בשגיאות התחברות
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || error.response?.data?.title;
        if (errorMessage?.includes('password') || errorMessage?.includes('סיסמה')) {
          return rejectWithValue('הסיסמה שגויה - אנא נסה שוב');
        }
        if (errorMessage?.includes('user') || errorMessage?.includes('משתמש') || errorMessage?.includes('not found')) {
          return rejectWithValue('המשתמש לא קיים במערכת');
        }
        return rejectWithValue('פרטי ההתחברות שגויים');
      }
      if (error.response?.status === 404) {
        return rejectWithValue('המשתמש לא קיים במערכת');
      }
      return rejectWithValue('שגיאה בהתחברות - אנא נסה שוב');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return data;
    } catch (error) {
      // אם השרת לא עובד, החזר נתונים מדומים
      if (error.response?.status === 404) {
        return {
          firstName: 'אדמין',
          lastName: 'מערכת',
          phone: '050-1234567',
          address: 'רחוב הרצל 123',
          city: 'תל אביב',
          postalCode: '12345'
        };
      }
      throw error;
    }
  }
);

// פרופיל משתמש לפי מזהה (לאדמין) – שומר במפה adminProfiles
export const fetchUserProfileByIdAdmin = createAsyncThunk(
  'user/fetchProfileByIdAdmin',
  async (userId, { getState }) => {
    const token = getState().user.token;
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return { userId, profile: data };
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, profileData }, { getState }) => {
    const token = getState().user.token;
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return data;
  }
);

// מחיקת משתמש
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { getState }) => {
    const token = getState().user.token;
    await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return userId;
  }
);

// מחיקת משתמש ע"י אדמין (לא משפיעה על סשן האדמין)
export const adminDeleteUser = createAsyncThunk(
  'user/adminDeleteUser',
  async (userId, { getState }) => {
    const token = getState().user.token;
    await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return userId;
  }
);

// קבלת כל המשתמשים (לאדמין)
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { getState }) => {
    const token = getState().user.token;
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return data;
  }
);

// עדכון סטטוס משתמש
export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async ({ userId, status }, { getState }) => {
    const token = getState().user.token;
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return { userId, status: data.status };
  }
);

// פונקציה פשוטה לבדיקה אם המשתמש הוא אדמין
const checkIfAdmin = (token) => {
  if (!token) {
    return false;
  }
  
  try {
    // פענוח הטוקן בצורה פשוטה
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    const decodedString = atob(padded);
    const decoded = JSON.parse(decodedString);
    
    // בדיקה אם האימייל מכיל "admin" או אם זה משתמש עם ID 5 (אדמין)
    const email = decoded.sub || decoded.email;
    const userId = decoded.userId;
    
    // בדיקה אם האימייל מכיל "admin"
    const isAdminByEmail = email && email.toLowerCase().includes('admin');
    
    // בדיקה אם זה משתמש עם ID 5 (אדמין)
    const isAdminById = userId === "5";
    
    const isAdmin = isAdminByEmail || isAdminById;
    
    return isAdmin;
  } catch (error) {
    return false;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  profile: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isAdmin: checkIfAdmin(localStorage.getItem('token')),
  allUsers: [],
  allUsersLoading: false,
  allUsersError: null,
  adminProfiles: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem('token');
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = checkIfAdmin(action.payload);
      localStorage.setItem('token', action.payload);
    },
    
    refreshAdminStatus: (state) => {
      state.isAdmin = checkIfAdmin(state.token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = checkIfAdmin(action.payload.token);
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = checkIfAdmin(action.payload.token);
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.profile = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        localStorage.removeItem('token');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Admin Delete User
      .addCase(adminDeleteUser.pending, (state) => {
        state.allUsersLoading = true;
        state.allUsersError = null;
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        state.allUsersLoading = false;
        state.allUsers = state.allUsers.filter(u => u.id !== action.payload);
      })
      .addCase(adminDeleteUser.rejected, (state, action) => {
        state.allUsersLoading = false;
        state.allUsersError = action.error.message;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.allUsersLoading = true;
        state.allUsersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsersLoading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.allUsersLoading = false;
        state.allUsersError = action.error.message;
      })
      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.allUsersLoading = true;
        state.allUsersError = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.allUsersLoading = false;
        const userIndex = state.allUsers.findIndex(user => user.id === action.payload.userId);
        if (userIndex !== -1) {
          state.allUsers[userIndex].status = action.payload.status;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.allUsersLoading = false;
        state.allUsersError = action.error.message;
      })
      // Fetch user profile by id (admin)
      .addCase(fetchUserProfileByIdAdmin.fulfilled, (state, action) => {
        const { userId, profile } = action.payload;
        state.adminProfiles[userId] = profile;
      });
  },
});

export const { logout, clearError, setToken, refreshAdminStatus } = userSlice.actions;
export default userSlice.reducer;
