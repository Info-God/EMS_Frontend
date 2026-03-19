import { combineReducers, configureStore } from '@reduxjs/toolkit';
import articleReducer from './features/submission';
import submissionListReducer from './features/submissionList';
import workflowReducer from './features/workflowSlice';
import dashboardReducer from './features/dashboardSlice';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { globalSlice } from './features/globle';
import { journalSlice } from './features/journalsSlice';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import countryReducer from "./features/countrySlice";

const appReducer = combineReducers({
  article: articleReducer,
  workflow: workflowReducer,
  global: globalSlice.reducer,
  dashboard: dashboardReducer,
  submissionList: submissionListReducer,
  journal: journalSlice.reducer,
  auth: authReducer,
  user: userReducer,
  country:countryReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

