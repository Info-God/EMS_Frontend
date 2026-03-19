import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";

export interface DeletePayload {
  id: number | string;     // article id
  doc_title: string;
  file?: File | null;      // optional because backend allows empty
}

export interface DeleteResponse {
  status: boolean | string;
  message: string;
  data?: any;
}

export const useDeleteDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteDocument = useCallback(
    async (payload: DeletePayload): Promise<DeleteResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append("doc_title", payload.doc_title);

        if (payload?.file) {
          formData.append("file", payload.file);
        }

        const token = localStorage.getItem("token");

        const res = await axiosClient.delete<DeleteResponse>(
          `/author/delete-file/${payload.id}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token || "",
            },
            data: formData, // <-- PUT THE FORM DATA HERE (DELETE BODY)
          }
        );

        setSuccess(true);
        return res.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "File deletion failed. Try again.";

        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    deleteDocument,
    loading,
    error,
    success,
  };
};
