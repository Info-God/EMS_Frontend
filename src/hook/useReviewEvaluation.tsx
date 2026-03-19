import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";
import type { ReviewEvaluationResponse } from "../types";

export const useReviewEvaluation = () => {
  const [data, setData] = useState<ReviewEvaluationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewEvaluation = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axiosClient.get<ReviewEvaluationResponse>(
        `/review-evaluation/${id}`,
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      setData(res.data);
      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        "Unable to fetch review evaluation data.";

      setError(msg);
      // throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchReviewEvaluation,
    data,
    loading,
    error,
  };
};
