import { configureStore } from '@reduxjs/toolkit'
import conversationReducer from '../chats/slice';
import authReducer from '../auth/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
