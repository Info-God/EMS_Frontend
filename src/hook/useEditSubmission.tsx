import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";
import type { SubmissionResponse } from "../types";


export interface UpdateSubmissionPayload {
  title?: string;
  category?: string | number;
  file?: File | null;
  image?: File | null;
  [key: string]: any;
}

export const useUpdateSubmission = () => {
  const [data, setData] = useState<SubmissionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSubmission = useCallback(
    async (id: number | string, updatedFields: UpdateSubmissionPayload) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token") ?? "";
        const formData = new FormData();

        // 🔥 Add ONLY fields that are not undefined
        Object.entries(updatedFields).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        });

        // If no fields were modified, do nothing.
        if (formData.keys().next().done) {
          throw new Error("No changes detected");
        }

        const res = await axiosClient.post<SubmissionResponse>(
          `/submission/${id}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setData(res.data);
        return res.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ??
          err?.message ??
          "Unable to update submission.";

        setError(msg);
        // throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    updateSubmission,
    data,
    loading,
    error,
  };
};
