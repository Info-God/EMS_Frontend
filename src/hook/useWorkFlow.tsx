// src/hooks/useWorkflow.ts

import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";
import { useDispatch } from "react-redux";
import {
  setWorkflowData,
  setWorkflowError,
  setWorkflowLoading,
} from "../lib/store/features/workflowSlice";
import type { WorkflowPayload } from "../types";
import { useLogout } from "./useLogout";
import { useAppSelector } from "../lib/store/store";

export const useWorkflow = () => {
  const dispatch = useDispatch();
  const { logout } = useLogout()
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [data, setData] = useState<WorkflowPayload | null>(null);
  const { articles_table } = useAppSelector(s => s.dashboard.data)
  const fetchWorkflow = useCallback(
    async (articleId: number | string) => {

      setLoadingLocal(true);
      setErrorLocal(null);
      dispatch(setWorkflowLoading(true));

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const body = articles_table.length && articles_table[0].newuser ? {
          "article_id": 65755555,
        } : {
          "article_id": articleId,
        }
        const res = await axiosClient.post<WorkflowPayload>(
          "/task-progress",
          body,
          {
            headers: {
              Authorization: token || "",
            },
          }
        );

        setData(res.data);
        dispatch(setWorkflowData(res.data));
        return res.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "Unable to fetch workflow details";

        setErrorLocal(msg);
        dispatch(setWorkflowError(msg));

        // throw err;
      } finally {
        setLoadingLocal(false);
        dispatch(setWorkflowLoading(false));
      }
    },
    [dispatch, logout]
  );

  return {
    fetchWorkflow,
    loading: loadingLocal,
    error: errorLocal,
    data,
  };
};
