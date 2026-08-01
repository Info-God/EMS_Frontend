// src/hooks/useMarkNotificationAsRead.ts

import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";

interface MarkNotificationPayload {
  user_id: number;
  article_id: number;
  type: string;
}

interface MarkNotificationResponse {
  status: boolean;
  message: string;
}

export const useMarkNotificationAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MarkNotificationResponse | null>(null);

  const markAsRead = useCallback(
    async (payload: MarkNotificationPayload) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const res = await axiosClient.post<MarkNotificationResponse>(
          "/markNotificationAsRead",
          payload,
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
          err?.response?.data?.message ||
          "Failed to mark notification as read";

        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    markAsRead,
    loading,
    error,
    data,
  };
};
