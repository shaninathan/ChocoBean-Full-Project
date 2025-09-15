import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId: product.productId,
          productName: product.productName,
          price: product.price,
          imagePath: product.imagePath,
          quantity: quantity,
        });
      }
      
      // עדכון הסכום הכולל
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      
      if (item) {
        if (quantity <= 0) {
          // הסרת הפריט אם הכמות 0 או פחות
          state.items = state.items.filter(item => item.productId !== productId);
        } else {
          item.quantity = quantity;
        }
        
        // עדכון הסכום הכולל
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      
      // עדכון הסכום הכולל
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
  },
});

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  setCartItems 
} = cartSlice.actions;

export default cartSlice.reducer;
