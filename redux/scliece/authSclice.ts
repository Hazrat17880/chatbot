// store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define user type
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  emailVerified: boolean;
  role?: string;
}

// Define state type
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user data after login
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      console.log("✅ User saved to Redux persist:", action.payload.email);
    },
    
    // Clear user data on logout
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      console.log("🗑️ User cleared from Redux persist");
    },
    
    // Update user data
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        console.log("✏️ User updated:", state.user.email);
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  setUser,
  clearUser,
  updateUser,
  setLoading,
  setError,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;