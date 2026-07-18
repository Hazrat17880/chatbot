// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web
import userReducer from "../scliece/authSclice"

// ✅ Configure persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Only persist the user slice
};

// ✅ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);

// ✅ Create store with persisted reducer
export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// ✅ Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;