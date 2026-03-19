import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";

interface VerifyCorrectionResponse {
  status: boolean;
  message: string;
}

export const useVerifyCorrection=()=>{

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<VerifyCorrectionResponse | null>(null);

    const verifyGalleyFile = useCallback(
    async (file_id: number) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const response = await axiosClient.post<VerifyCorrectionResponse>(
          "/author/verify-galley-file",
          { file_id },
          {
            headers: {
              Authorization: token || "",
              "Content-Type": "application/json",
            },
          }
        );

        setData(response.data);
        return response.data;
      } catch (err: any) {
        const msg = err?.response?.data?.message || "failed to verify file";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    verifyGalleyFile,
    loading,
    error,
    data,
  };
};