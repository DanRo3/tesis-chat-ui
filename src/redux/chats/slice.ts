import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createConversation, deleteConversation, getConversationDetails, getConversations, getNextsConversations, renameConversation, sendMessage } from './actions'
import { ChatDetails, GetConversationsResponse, Message } from '../../types/chat';


interface ConversationState {
  currentConversationId: string | ''
  currentConversation: ChatDetails
  historyChat: GetConversationsResponse
  loading: boolean
  loadingDelete: boolean
  error: string | null
}

const initialState: ConversationState = {
  currentConversationId: '',
  currentConversation: {
    chat:{
      chat_messages: [],
      uid: '',
      slug: '',
      createdAt: '',
      updatedAt: '',
      chat_room: '',
      title: '',
      description: '',
      registered_by: '',
      registered_by_username: '',
    }
  },
  historyChat: {
    count: 0,
    next: null,
    previous: null,
    results: {
      chats: [],
    }
  },
  loading: false,
  loadingDelete: false,
  error: null,
}

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addMessageToConversation: (state, action: PayloadAction<Message>) => {
      state.currentConversation.chat.chat_messages.push(action.payload);
    },
    newConversation: (state) => {
      state.currentConversationId = '';
      state.currentConversation = {
        chat: {
          chat_messages: [],
          uid: '',
          slug: '',
          createdAt: '',
          updatedAt: '',
          chat_room: '',
          title: '',
          description: '',
          registered_by: '',
          registered_by_username: '',
        }
      };
    },
    setCurrentConversationId: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.historyChat = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getNextsConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNextsConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.historyChat.next = action.payload.next;
        state.historyChat.count = action.payload.count;
        state.historyChat.previous = action.payload.previous;
        state.historyChat.results.chats = [...state.historyChat.results.chats, ...action.payload.results.chats];
      })
      .addCase(getNextsConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(renameConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renameConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.historyChat.results.chats = state.historyChat.results.chats.map(conv => conv.uid === action.payload.uid ? { ...conv, title: action.payload.title } : conv);
      })
      .addCase(renameConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteConversation.pending, (state) => {
        state.loadingDelete = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.historyChat.results.chats = state.historyChat.results.chats.filter(conv => conv.uid !== action.payload);
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.historyChat.results.chats = [action.payload,...state.historyChat.results.chats];
        state.currentConversationId = action.payload.uid;
        state.currentConversation = {
          chat: {
            uid: action.payload.uid,
            slug: action.payload.slug,
            createdAt: action.payload.created_at,
            updatedAt: action.payload.updated_at,
            chat_room: action.payload.uid,
            chat_messages: [],
            title: action.payload.title,
            description: action.payload.description,
            registered_by: action.payload.registered_by,
            registered_by_username: action.payload.registered_by_username,
          }
        };
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        console.log('Mensaje del asistente recibido:', action.payload);
        state.loading = false;
        const asistente = {
          uid: action.payload.uid,
          slug: action.payload.slug,
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.updatedAt,
          chat_room: action.payload.chat_room,
          text_message: action.payload.text_message,
          rol: action.payload.rol,
          image: action.payload.image,  // Ensure image is null if not provided
        }
        console.log(asistente)
        // Use concat or spread to create a new array reference
        state.currentConversation.chat.chat_messages = state.currentConversation.chat.chat_messages.concat(asistente);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getConversationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
      })
      .addCase(getConversationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
})

export const { addMessageToConversation, newConversation, setCurrentConversationId } = conversationSlice.actions;
export default conversationSlice.reducer;