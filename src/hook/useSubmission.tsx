import { useState } from "react";
import axiosClient from "../lib/axios-client";
import type { SubmissionPayload, SubmissionResponse } from "../types";



export const useSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<SubmissionResponse | null>(null);

  const submitPaper = async (payload: SubmissionPayload)=> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append all fields
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      const res = await axiosClient.post<SubmissionResponse>(
        "/submission/store",
        formData,
        {
          headers: {
            Authorization: token || "",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //->console.log(res.data)
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Submission failed");
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitPaper, response, loading, error };
};
