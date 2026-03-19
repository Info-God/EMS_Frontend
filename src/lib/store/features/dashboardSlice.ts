import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardState, DashboardResponse } from "../../../types";



const initialState: DashboardState = {
  loading: false,
  error: null,
  data: {
    status: false,
    counts: {
      approve: 0,
      pending: 0,
      accepted: 0,
      published: 0,
    },
    latest: null,
    dropdown_list: [],
    articles_table: [],
    notifications: []
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setDashboardError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setDashboardData: (state, action: PayloadAction<DashboardResponse>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setDeleteDropdownItem: (state, action: PayloadAction<number>) => {
      state.data.dropdown_list = state.data.dropdown_list.filter((item => item.id !== action.payload));
    }
  },
});

export const {
  setDashboardLoading,
  setDashboardError,
  setDashboardData,
  setDeleteDropdownItem
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
