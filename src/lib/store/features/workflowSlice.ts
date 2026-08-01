import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WorkflowState, WorkflowPayload } from "../../../types";

const initialState: WorkflowState = {
  loading: false,
  error: null,
  data: null,
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setWorkflowLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setWorkflowError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateWorkflowTaskStatus: (state, action: PayloadAction<{ task_name: string; status: "In progress" | "Completed" | "Deferred" | "Editor approval" | "Not Started" }>) => {
      if (!state.data) return;
      const { task_name, status } = action.payload;
      const taskIndex = state.data.tasks.findIndex(task => task.task_name === task_name);
      if (taskIndex !== -1) {
        state.data.tasks[taskIndex].status = status;
      }
    },

    
    updateWorkflowPeerReviewStatus: (state, action: PayloadAction<{ step_name: string; status: "In progress" | "Completed" | "Deferred" | "Editor approval" | "Not Started" }>) => {
      const { step_name, status } = action.payload;
      if (!state.data) return;
      const reviewIndex = state.data.peer_review_tasks.findIndex(task => task.task_name.includes(step_name));
      //->console.log(reviewIndex)
      if (reviewIndex !== -1) {
        state.data.peer_review_tasks[reviewIndex].status = status;
      }
    },

    setWorkflowData: (state, action: PayloadAction<WorkflowPayload>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setWorkflowLoading, setWorkflowError, setWorkflowData, updateWorkflowTaskStatus, updateWorkflowPeerReviewStatus } =
  workflowSlice.actions;

export default workflowSlice.reducer;
