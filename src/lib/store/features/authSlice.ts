import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  user_type: string;
  journal_id: number;
  department: string | null;
  dob: string | null;
  profile: string | null;
  phone: string | null;
  address: string | null;
  image_path: string | null;
  status: number | null;
  created_at: string;
  updated_at: string;
  active_status: number;
  avatar: string | null;
  dark_mode: number;
  messenger_color: string;
  reviewerid: number | null;
}

export interface AuthState {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(
      state,
      action: PayloadAction<{ user: UserType; token: string }>
    ) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user_id", action.payload.user.id.toString());
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
