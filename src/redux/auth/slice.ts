import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../types/interfaces";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserDetails;
  loading: boolean;
  error: string | null;
}

const getTokenFromLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error accessing localStorage", error);
    return null;
  }
};

const initialState: AuthState = {
  accessToken: getTokenFromLocalStorage("accessToken"),
  refreshToken: getTokenFromLocalStorage("refreshToken"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : {
        uid: "",
        is_active: false,
        email: "",
        username: "",
        is_premium: false,
        is_staff: 0,
        is_superuser: 0,
        day_expense: 0,
        daily_spending_limit: 0,
        spending: 0,
        count_emote: 0,
        count_emote_image: 0,
      },
  loading: false,
  error: null,
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const fetchFromApi = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error("Error en la solicitud");
    }
    
    if (errorData && errorData.username && Array.isArray(errorData.username)) {
      throw new Error(errorData.username[0]);
    } else {
      throw new Error(errorData.detail || "Error en la solicitud");
    }
  }

  return response.json();
};

export const authenticateUser = createAsyncThunk(
  "auth/authenticateUser",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchFromApi(`${baseUrl}/auth/jwt/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const { refresh: refreshToken, access: token } = data;

      return { token, refreshToken };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Error desconocido");
      }
    }
  }
);

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (
    { email, username, password, re_password }: { email: string; username: string; password: string; re_password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchFromApi(`${baseUrl}/auth/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password, re_password }),
      });

      return data;
    } catch (error: any) {
      // Estandariza el formato del error
      return rejectWithValue(error);
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_,{ rejectWithValue }) => {
    try {
      const data = await fetchFromApi(`${baseUrl}/auth/users/me/`, {
        method: "GET",
        headers: {
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
        
      });

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    const { refreshToken } = (getState() as { auth: AuthState }).auth;

    if (!refreshToken) {
      return rejectWithValue("No refresh token available");
    }

    try {
      const data = await fetchFromApi(`${baseUrl}/auth/jwt/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const { access: accessToken } = data;
      return { accessToken };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Error desconocido al refrescar el token");
      }
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = {
        uid: null,
        is_active: null,
        email: null,
        username: null,
        is_premium: null,
        is_staff: null,
        is_superuser: null,
        day_expense: null,
        daily_spending_limit: null,
        spending: null,
        count_emote: null,
        count_emote_image: null,
      };
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        const { token: accessToken, refreshToken } = action.payload; // Usa nombres de clave consistentes
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.loading = false;
        state.error = null;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        const { accessToken } = action.payload;
        state.accessToken = accessToken;
        localStorage.setItem("accessToken", accessToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state: AuthState) => {
        state.loading = false;
        state.error = null;
        // Handle successful user creation (e.g., store user data, redirect)
      })
     .addCase(createUser.rejected, (state: AuthState, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
