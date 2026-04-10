import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentUser,
  loginRequest,
  registerRequest,
  resendVerificationRequest,
  verifyRegistrationRequest,
} from "../../services/api/authApi";
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

export const verifyRegistration = createAsyncThunk("auth/verifyRegistration", async (payload, { rejectWithValue }) => {
  try {
    return await verifyRegistrationRequest(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const resendVerificationCode = createAsyncThunk("auth/resendVerificationCode", async (payload, { rejectWithValue }) => {
  try {
    return await resendVerificationRequest(payload);
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
    verificationCode: storedSession?.verificationCode ?? "",
    verificationExpiresAt: storedSession?.verificationExpiresAt ?? null,
    status: "idle",
    registerStatus: "idle",
    verifyStatus: "idle",
    resendStatus: "idle",
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
      state.verificationCode = "";
      state.verificationExpiresAt = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.registerStatus = "idle";
      state.verifyStatus = "idle";
      state.resendStatus = "idle";
      state.error = null;
      state.fieldErrors = {};
      state.verificationPending = false;
      state.verificationEmail = "";
      state.verificationCode = "";
      state.verificationExpiresAt = null;
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
        state.verificationCode = "";
        state.verificationExpiresAt = null;
        persistSession({
          user: state.user,
          token: state.token,
          verificationEmail: "",
          verificationCode: "",
          verificationExpiresAt: null,
        });
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
        state.verificationCode = action.payload.verification?.code ?? "";
        state.verificationExpiresAt = action.payload.verification?.expires_at ?? null;
        state.error = null;
        persistSession({
          user: state.user,
          token: state.token,
          verificationEmail: state.verificationEmail,
          verificationCode: state.verificationCode,
          verificationExpiresAt: state.verificationExpiresAt,
        });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.error = action.payload?.message ?? "Registration failed.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(verifyRegistration.pending, (state) => {
        state.verifyStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(verifyRegistration.fulfilled, (state) => {
        state.verifyStatus = "succeeded";
        state.verificationPending = false;
        state.verificationCode = "";
        state.verificationExpiresAt = null;
        state.error = null;
        persistSession({
          user: state.user,
          token: state.token,
          verificationEmail: state.verificationEmail,
          verificationCode: "",
          verificationExpiresAt: null,
        });
      })
      .addCase(verifyRegistration.rejected, (state, action) => {
        state.verifyStatus = "failed";
        state.error = action.payload?.message ?? "Verification failed.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(resendVerificationCode.pending, (state) => {
        state.resendStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(resendVerificationCode.fulfilled, (state, action) => {
        state.resendStatus = "succeeded";
        state.verificationPending = true;
        state.verificationCode = action.payload.verification?.code ?? "";
        state.verificationEmail = action.payload.verification?.email ?? state.verificationEmail;
        state.verificationExpiresAt = action.payload.verification?.expires_at ?? null;
        state.error = null;
        persistSession({
          user: state.user,
          token: state.token,
          verificationEmail: state.verificationEmail,
          verificationCode: state.verificationCode,
          verificationExpiresAt: state.verificationExpiresAt,
        });
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.resendStatus = "failed";
        state.error = action.payload?.message ?? "Unable to resend verification code.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(hydrateSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = "succeeded";
        persistSession({
          user: state.user,
          token: state.token,
          verificationEmail: state.verificationEmail,
          verificationCode: state.verificationCode,
          verificationExpiresAt: state.verificationExpiresAt,
        });
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
