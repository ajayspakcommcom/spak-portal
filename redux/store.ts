import { combineReducers, configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Assuming your slice files are now TypeScript modules
import authAdminSlice from './auth/auth-admin-slice';
import taskAdminSlice from './task/task-admin-slice';

// Define the root state type
export type RootState = ReturnType<typeof rootReducer>;

// Define the type for the persist config
const persistConfig: PersistConfig<RootState> = {
    key: 'root',
    storage: AsyncStorage,
    version: 1,
    blacklist: ['search', 'products']
};

const rootReducer = combineReducers({
    authAdmin: authAdminSlice,
    taskAdmin: taskAdminSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: EnhancedStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware<any>({
            serializableCheck: false // Change this to true if you want to enable serializable check
        }),
});

// If you need to type the dispatch and state
export type AppDispatch = typeof store.dispatch;
//export type RootState = ReturnType<typeof store.getState>;
