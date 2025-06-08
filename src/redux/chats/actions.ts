import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatDetails, GetConversationsResponse, SendMessage, Chats } from "../../types/chat";
import { Message } from "../../types/chat";


const baseUrl = import.meta.env.VITE_API_BASE_URL;

const fetchFromApi = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);

  // Si la respuesta no es exitosa, intentar extraer el mensaje de error
  if (!response.ok) {
    let errorMessage = "Error en la solicitud";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || JSON.stringify(errorData) || errorMessage;
    } catch {
      // Si no hay JSON en la respuesta de error, usamos el statusText
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  // Manejar correctamente respuestas sin contenido (204 No Content)
  if (response.status === 204) {
    return null;
  }

  // Intentar parsear la respuesta JSON
  try {
    return await response.json();
  } catch {
    return null; // Si la respuesta es vacía o no es JSON, retornar null
  }
};

export const getConversations = createAsyncThunk(
    "chats/getConversations",
    async (_, { rejectWithValue }) => {
      try {
        const data: GetConversationsResponse = await fetchFromApi(`${baseUrl}/api/chats/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        });
  
        return data as GetConversationsResponse;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        } else {
          return rejectWithValue("Error desconocido");
        }
      }
    }
);

export const getNextsConversations = createAsyncThunk(
  'chats/getNextConversation',
  async(next: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats/?p=${next}`,
        {
          method: "GET",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch next emote page");
        }
  
        const data = await response.json();
        return data as GetConversationsResponse;
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
);

export const renameConversation = createAsyncThunk(
  "chats/renameConversation",
  async ({ id, newTitle }: { id: string, newTitle: string }, { rejectWithValue }) => {
    try {
      const data = await fetchFromApi(`${baseUrl}/api/chats/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      return data as Chats;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Error desconocido");
      }
    }
  }
);

export const deleteConversation = createAsyncThunk(
  "chats/deleteConversation",
  async (id: string, { rejectWithValue }) => {
    try {
      await fetchFromApi(`${baseUrl}/api/chats/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      });
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Error desconocido");
      }
    }
  }
);

export const createConversation = createAsyncThunk(
  "chats/createConversation",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchFromApi(`${baseUrl}/api/chats/`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          title: "Nueva Conversación",
          description: "Esta es una nueva conversación",
        }),
      });
      return data as Chats;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Error desconocido");
      }
    }
  }
);

export const getConversationDetails = createAsyncThunk(
  "chats/getConversationDetails",
  async (uid: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/chats/${uid}/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la conversación');
      }

      const data = await response.json();
      return data as ChatDetails;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Error desconocido");
      }
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chats/sendMessage",
  async ({ message, chat_room }: { message: SendMessage; chat_room: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('text_message', message.text_message);
      if (message.image) {
        formData.append('image', message.image);
      }

      const data  = await fetchFromApi(`${baseUrl}/api/chats/${chat_room}/messages/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });
      const result: Message = data.message
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Error desconocido");
      }
    }
  }
);

