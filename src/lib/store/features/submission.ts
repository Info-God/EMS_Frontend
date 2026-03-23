// articleSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ArticleState, ArticleUpdatePayload, FileItem, UploadType } from "../../../types";

const initialState: ArticleState = {
  loading: false,
  error: null,
  success: false,
  journalShortWithId: "",
  article: null,
  tasks: [],
  reviews: [],
  acceptances: [],
  final_download_link: "",
  files_0: [],
  files_1: [],
  files_2: [],
  files_3: [],
  files_4: [],
  final_payment_scripts: [],
  final_manuscripts: [],
  final_copy_right_forms: [],
  copy_right_files: [],
  profile: null,
  gst: 0,
  payment: null,
};

export const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setArticlePayload: (
      state,
      action: PayloadAction<ArticleState>
    ) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };
    },

    updateTaskStatus: (state, action: PayloadAction<{ task_name: string; status: "In progress" | "Completed" | "Deferred" | "Editor approval" | "Not Started" }>) => {
      const { task_name, status } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.task_name === task_name);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = status;
      }
    },

    updatePeerReviewStatus: (state, action: PayloadAction<{ step_name: string; status: "In progress" | "Completed" | "Deferred" | "Editor approval" | "Not Started" }>) => {
      const { step_name, status } = action.payload;
      const reviewIndex = state.reviews.findIndex(task => task.name === step_name);
      if (reviewIndex !== -1) {
        state.reviews[reviewIndex].status = status;
      }
    },

    updateArticleFromPusher: (state, action: PayloadAction<ArticleUpdatePayload>) => {
      const { field, value, article } = action.payload;

      // Update the entire article object
      if (article) {
        state.article = article;
      }

      // Additionally update specific field if article object exists in state
      if (state.article && field) {
        switch (field) {
          case 'details':
            // Update nested fields from value object
            if (value.notes !== undefined) {
              state.article.notes = value.notes;
            }
            if (value.doi_link !== undefined) {
              state.article.doi_link = value.doi_link;
            }
            break;

          case 'status_type':
            state.article.status_type = value;
            break;

          case 'review_status':
            state.article.review_status = value;
            break;

          // Add more field cases as needed
          default:
            // For simple field updates
            if (field in state.article) {
              (state.article as any)[field] = value;
            }
            break;
        }
      }
    },

    addFinalFile: (state, action: PayloadAction<{ type: string, file: FileItem }>) => {
      const { type, file } = action.payload;
      if (type === 'manuscript') {
        state.final_manuscripts.push(file);
      } else if (type === 'copyright') {
        state.final_copy_right_forms.push(file);
      } else if (type === 'payment') {
        state.final_payment_scripts.push(file);
      }
      else if (type === 'file') {
        state.files_0.push(file);
      }
      else if(type === 'galley'){
        state.files_4.push(file)
      }
    },
    
    removeFinalFile: (state, action: PayloadAction<{ type: UploadType, id: number }>) => {
      const { type, id } = action.payload;

      if (type === 'manuscript') {
        state.final_manuscripts = state.final_manuscripts.filter(item => item.id !== id);

      } else if (type === 'copyright') {
        state.final_copy_right_forms = state.final_copy_right_forms.filter(item => item.id !== id);

      } else if (type === 'payment') {
        state.final_payment_scripts = state.final_payment_scripts.filter(item => item.id !== id);
      }
      else if (type === 'file') {
        state.files_0 = state.files_0.filter(item => item.id !== id);
      }
    },

    updateFile: (state, action: PayloadAction<{ type: UploadType, file: FileItem }>) => {
      const { type, file } = action.payload;
      if (type === 'manuscript') {
        const index = state.final_manuscripts.findIndex(f => f.id == file.id);
        if (index !== -1) {
          state.final_manuscripts[index] = file;
        }
      } else if (type === 'copyright') {
        const index = state.final_copy_right_forms.findIndex(f => f.id == file.id);
        if (index !== -1) {
          state.final_copy_right_forms[index] = file;
        }
      } else if (type === 'payment') {
        const index = state.final_payment_scripts.findIndex(f => f.id == file.id);
        if (index !== -1) {
          state.final_payment_scripts[index] = file;
        }
      }
      else if (type === 'file') {
        const index = state.files_0.findIndex(f => f.id == file.id);
        if (index !== -1) {
          state.files_0[index] = file;
        }
      }
      else if (type === 'galley') {
        const index = state.files_4.findIndex(s => s.id == file.id);
        if (index !== -1) {
          state.files_4[index] = file;
        }
      }
    },

    // for galley verification api
    verifyGalleyFile: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload;
      if (state.files_4) {
        const fileIndex = state.files_4.findIndex(
          (file: FileItem) => file.id === id
        );
        if (fileIndex !== -1) {
          state.files_4[fileIndex].verified_by = "Final Proof Approved";
        }
      }
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setArticlePayload, 
  addFinalFile, 
  updateFile, 
  removeFinalFile, 
  updateTaskStatus, 
  updateArticleFromPusher, 
  updatePeerReviewStatus,
  verifyGalleyFile
} = articleSlice.actions;

export default articleSlice.reducer;
