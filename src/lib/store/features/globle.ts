// src/lib/store/features/global/globalSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
  isLoading: boolean;
  activePaperId?: number | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  Frizee: boolean
  refetch: boolean;
  userRole: string | null;
  environment: 'local' | 'dev' | 'staging' | 'prod';
  token?: string | null;
  [key: string]: any; // enables dynamic extension for additional global flags
  background: boolean;
  tutorialStep: number
}

const initialState: GlobalState = {
  isLoading: false,
  theme: 'light',
  sidebarOpen: true,
  userRole: null,
  environment: 'dev',
  refetch: false,
  token: null,
  Frizee: true,
  background: false,
  tutorialStep: parseInt(localStorage.getItem("step")??"0")
};
//check where the clause is breaking in the background rendre
export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTutorialStep: (state, action: PayloadAction<number>) => {
      if (action.payload > 3) {
        state.tutorialStep = 0
      }
      state.tutorialStep = action.payload
    },
    setAddTutorial: (state) => {
      if (!localStorage.getItem("tutorialCompleted")) {
        state.tutorial = true;
        state.background = true
        state.tutorialStep = 1
      }
    },
    setRemoveTutorial: (state) => {
      // remove the tutorial
      state.tutorial = false;
      state.background = false
      localStorage.setItem("tutorialCompleted", "true")
      localStorage.setItem("step","12")
      state.tutorialStep=12
    },
    setBackground: (state, action: PayloadAction<boolean>) => {
        state.background = action.payload;
        state.tutorial = action.payload
    },
    setBackgroundProfile: (state, action: PayloadAction<boolean>) => {
      state.background = action.payload;
    },
    setActivePaperId: (state, action: PayloadAction<number | null>) => {
      state.activePaperId = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setUserRole: (state, action: PayloadAction<string | null>) => {
      state.userRole = action.payload;
    },
    setEnvironment: (
      state,
      action: PayloadAction<'local' | 'dev' | 'staging' | 'prod'>
    ) => {
      state.environment = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setFrizee: (state, action: PayloadAction<boolean>) => {
      state.Frizee = action.payload;
    },
    setRefetchContent: (state, action: PayloadAction<boolean>) => {
      state.refetch = action.payload;
    },
    setGlobalValue: (
      state,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  setLoading,
  toggleSidebar,
  setActivePaperId,
  setTheme,
  setUserRole,
  setEnvironment,
  setToken,
  setFrizee,
  setRefetchContent,
  setGlobalValue,
  setBackground,
  setBackgroundProfile, //-> only for the profile section
  setRemoveTutorial,
  setAddTutorial,
  setTutorialStep
} = globalSlice.actions;

export default globalSlice.reducer;
