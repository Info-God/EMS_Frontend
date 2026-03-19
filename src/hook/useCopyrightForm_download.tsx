import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";

// interface CopyrightFormResponse {
//   status: boolean;
//   message: string;
//   // backend may not wrap blob in data, so we handle raw response
// }

export const useFetchCopyrightForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Blob | null>(null);

  const fetchCopyrightForm = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token") || "";

        const res = await axiosClient.get(
          `/copyright-form/${id}`,
          {
            headers: {
              Authorization: token,
            },
            responseType: "blob", 
          }
        );

        const blob = res.data as Blob;
        setData(blob);

        return blob;
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Unable to fetch copyright form"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchCopyrightForm,
    loading,
    error,
    data,
  };
};
