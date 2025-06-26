import { configureStore } from '@reduxjs/toolkit';
import housekeeperReducer from './slices/housekeeperSlice';
import tasksReducer from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    housekeepers: housekeeperReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
