import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";

interface DeleteResponse {
  message?: string;
  status?: boolean;
  [key: string]: any;
}

export const useDeleteSubmission = () => {
  const [data, setData] = useState<DeleteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSubmission = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") ?? "";

      const res = await axiosClient.delete<DeleteResponse>(
        `/submission/${id}`,
        {
          headers: {
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      setData(res.data);
      return res.data;

    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        "Unable to delete submission. Please try again.";

      setError(msg);
      // throw err;

    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteSubmission,
    data,
    loading,
    error,
  };
};
