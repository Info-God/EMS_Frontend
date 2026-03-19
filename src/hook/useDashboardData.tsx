import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";
import { useDispatch } from "react-redux";
import {
  setDashboardLoading,
  setDashboardError,
  setDashboardData,
} from "../lib/store/features/dashboardSlice";
import type { DashboardResponse } from "../types";
import { useAppSelector } from "../lib/store/store";
import { setAddTutorial } from "../lib/store/features/globle";
import { useLogout } from "./useLogout";

export const useDashboard = () => {
  const dispatch = useDispatch();
  const {logout} = useLogout()
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const { user, token} = useAppSelector(state => state.auth)
  const localToken = token??localStorage.getItem("token")
  const fetchDashboard = useCallback(async () => {
    if (user===null && !localToken) {
      logout()
      return
    }
    setLoadingLocal(true);
    setErrorLocal(null);
    dispatch(setDashboardLoading(true));
    
    try {
      const token = localStorage.getItem("token");

      const res = await axiosClient.get<DashboardResponse>(
        "/get-dashboard-data",
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      setData(res.data);
      //->console.log("dashboard data", res.data);
      if (res.data.articles_table[0]?.newuser) {
        dispatch(setAddTutorial())
      }
      dispatch(setDashboardData(res.data));
      
      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Unable to fetch dashboard data";

      setErrorLocal(msg);
      dispatch(setDashboardError(msg));

      // throw err;
    } finally {
      setLoadingLocal(false);
      dispatch(setDashboardLoading(false));
    }
  }, [dispatch, user, localToken, logout]);

  return {
    fetchDashboard,
    loading: loadingLocal,
    error: errorLocal,
    data,
  };
};
