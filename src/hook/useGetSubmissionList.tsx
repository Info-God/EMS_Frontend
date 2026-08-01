import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";
import { useDispatch } from "react-redux";
import {
  setSubmissionListLoading,
  setSubmissionListError,
  setSubmissionListData,
} from "../lib/store/features/submissionList";
import type { SubmissionListResponse } from "../types";

export const useSubmissionList = () => {
  const dispatch = useDispatch();

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [data, setData] = useState<SubmissionListResponse | null>(null);

  const fetchSubmissionList = useCallback(
    async (userId: number, page: number = 1) => {
      setLocalLoading(true);
      setLocalError(null);
      dispatch(setSubmissionListLoading(true));

      try {
        const token = localStorage.getItem("token");

        const res = await axiosClient.post<SubmissionListResponse>(
          `/submissionList?page=${page}`,
          {
            user_id: userId,
          },
          {
            headers: {
              Authorization: token || "",
            },
          }
        );

        setData(res.data);
        dispatch(setSubmissionListData(res.data));

        return res.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "Unable to load your submissions.";

        setLocalError(msg);
        dispatch(setSubmissionListError(msg));

        // throw err;
      } finally {
        setLocalLoading(false);
        dispatch(setSubmissionListLoading(false));
      }
    },
    [dispatch]
  );

  return {
    fetchSubmissionList,
    data,
    loading: localLoading,
    error: localError,
  };
};
