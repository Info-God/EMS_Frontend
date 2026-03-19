import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";

export interface UploadPayload {
  id: number | string;      // article id
  doc_title: string;
  file: File;
}

export interface UploadResponse {
  status: boolean | string;
  message: string;
  data?: any;
}

export const useUploadDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadDocument = useCallback(
    async (payload: UploadPayload): Promise<UploadResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append("doc_title", payload.doc_title);
        formData.append("file", payload.file);

        const token = localStorage.getItem("token");

        const res = await axiosClient.post<UploadResponse>(
          `/author/upload-file/${payload.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token || "",
            },
          }
        );

        setSuccess(true);
        return res.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "File upload failed. Try again.";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    uploadDocument,
    loading,
    error,
    success,
  };
};
