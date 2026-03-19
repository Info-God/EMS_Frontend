import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";
import type { ApiResponse, CopyrightAcceptance } from "../types";



export const useCopyrightAcceptance = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CopyrightAcceptance[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCopyrightAcceptance = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post<ApiResponse>(
        "/copyright-acceptance",
        { user_id: userId },
        {
          headers: {
            Authorization: token || "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data.reverse());
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      console.error("Error fetching copyright acceptances:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchCopyrightAcceptance,
  };
};
