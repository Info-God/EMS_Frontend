import { useState } from "react";
import axiosClient from "../lib/axios-client";
import type { RegisterPayload, RegisterResponse } from "../types";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegisterResponse | null>(null);

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post<RegisterResponse>(
        "/register",
        payload
      );
      setData(response.data);
      //->console.log(response.data)
      const fullToken = `${response.data.token_type} ${response.data.token}`;
      localStorage.setItem("user_id", response.data.user.id.toString());
      localStorage.setItem("token", fullToken);
      localStorage.removeItem("tutorialCompleted");
      localStorage.removeItem("ProfileTutorial");
      return response.data;
    } catch (err: any) {
      setError(
        err?.response?.data?.message|| err?.response?.data?.errors?.email[0] || "Registration failed. Please try again."
      );
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, data, loading, error };
};