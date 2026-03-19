import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";

export const useFetchAcceptanceLetter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Blob | null>(null);

  const fetchAcceptanceLetter = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      const response = await axiosClient.get(
        `/acceptance-form/${id}`,
        {
          headers: {
            Authorization: token,
          },
          responseType: "blob", // critical for PDF/HTML document streams
        }
      );

      const blob = response.data as Blob;
      setData(blob);

      return blob;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to fetch acceptance email document"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchAcceptanceLetter,
    loading,
    error,
    data,
  };
};
