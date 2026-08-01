import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserType } from "./authSlice";

interface UserState {
  user: UserType | null;
  hydrated: boolean;
}

const initialState: UserState = {
  user: null,
  hydrated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.hydrated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.hydrated = false;
    },
    patchUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, patchUser } = userSlice.actions;
export default userSlice.reducer;
