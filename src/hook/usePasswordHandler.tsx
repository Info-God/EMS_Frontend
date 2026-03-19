import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";

interface ForgotPasswordPayload {
  email: string;
}
interface PasswordResponse {
  status: boolean;
  message: string;
}
interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PasswordResponse | null>(null);

  const resetPassword = useCallback(
    async (payload: ResetPasswordPayload) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.post<PasswordResponse>(
          "/auth/reset-password",
          payload
        );

        setData(res.data);
        return res.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Password reset failed";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    resetPassword,
    loading,
    error,
    data,
  };
};


export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PasswordResponse | null>(null);

  const forgotPassword = useCallback(
    async (payload: ForgotPasswordPayload) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.post<PasswordResponse>(
          "/auth/forgot-password",
          payload
        );

        setData(res.data);
        return res.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Password recovery failed";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    forgotPassword,
    loading,
    error,
    data,
  };
};
