import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { SubmissionListState, SubmissionListResponse } from "../../../types";

const initialState: SubmissionListState = {
  loading: false,
  error: null,
  data: null,
};

const submissionListSlice = createSlice({
  name: "submissionList",
  initialState,
  reducers: {
    setSubmissionListLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubmissionListError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSubmissionListData: (
      state,
      action: PayloadAction<SubmissionListResponse>
    ) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setSubmissionListLoading,
  setSubmissionListError,
  setSubmissionListData,
} = submissionListSlice.actions;

export default submissionListSlice.reducer;
