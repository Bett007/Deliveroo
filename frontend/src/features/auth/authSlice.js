import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser, loginRequest, registerRequest } from "../../services/api/authApi";
import { clearStoredSession, persistSession, readStoredSession } from "./authStorage";

const storedSession = readStoredSession();

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    return await loginRequest(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const registerUser = createAsyncThunk("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    return await registerRequest(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const hydrateSession = createAsyncThunk("auth/hydrateSession", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token) {
    return rejectWithValue({ message: "Missing authentication token." });
  }

  try {
    return await fetchCurrentUser(token);
  } catch (error) {
    return rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedSession?.user ?? null,
    token: storedSession?.token ?? null,
    verificationPending: false,
    verificationEmail: storedSession?.verificationEmail ?? "",
    status: "idle",
    registerStatus: "idle",
    error: null,
    fieldErrors: {},
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
    markVerificationStep: (state, action) => {
      state.verificationPending = true;
      state.verificationEmail = action.payload;
    },
    completeVerificationStep: (state) => {
      state.verificationPending = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.registerStatus = "idle";
      state.error = null;
      state.fieldErrors = {};
      state.verificationPending = false;
      state.verificationEmail = "";
      clearStoredSession();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.error = null;
        state.verificationPending = false;
        state.verificationEmail = "";
        persistSession({ user: state.user, token: state.token, verificationEmail: "" });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Login failed.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = "succeeded";
        state.verificationPending = true;
        state.verificationEmail = action.payload.user.email;
        state.error = null;
        persistSession({ user: state.user, token: state.token, verificationEmail: state.verificationEmail });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.error = action.payload?.message ?? "Registration failed.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(hydrateSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = "succeeded";
        persistSession({ user: state.user, token: state.token, verificationEmail: state.verificationEmail });
      })
      .addCase(hydrateSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        clearStoredSession();
      });
  },
});

export const { clearAuthError, markVerificationStep, completeVerificationStep, logoutUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
