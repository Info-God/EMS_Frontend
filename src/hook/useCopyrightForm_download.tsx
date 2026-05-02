import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";

interface CopyrightFormResponse {
  status: boolean;
  message: string;
  // backend may not wrap blob in data, so we handle raw response
}

export const useFetchCopyrightForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CopyrightFormResponse | null>(null);

  const fetchCopyrightForm = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        setData(null);

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

        if (blob.type === "application/json") {
          const text = await blob.text();
          const jsonData = JSON.parse(text);
          setData(jsonData);
          return jsonData;
        }

        return blob;
      } catch (err: any) {
        let msg = "Unable to fetch copyright form";
        if (err?.response?.data instanceof Blob && err.response.data.type === "application/json") {
          try {
            const text = await err.response.data.text();
            const json = JSON.parse(text);
            msg = json.message || msg;
            setData(json);
            return json;
          } catch(e) {}
        } else {
          msg = err?.response?.data?.message || msg;
        }
        setError(msg);
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
