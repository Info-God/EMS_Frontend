import { useState } from "react";
import axiosClient from "../lib/axios-client";
import { useAppDispatch } from "../lib/store/store";
import { loginFailure, loginStart, loginSuccess, type UserType } from "../lib/store/features/authSlice";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  user: UserType;
  token: string;
  token_type: string;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async (payload: LoginPayload) => {
    try {
      dispatch(loginStart());
      setLoading(true);

      const res = await axiosClient.post<LoginResponse>("/login", payload);

      const fullToken = `${res.data.token_type} ${res.data.token}`;
      localStorage.setItem("token", fullToken);

      dispatch(
        loginSuccess({
          user: res.data.user ?? token,
          token: fullToken,
        })
      );

      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed";

      dispatch(loginFailure(msg));
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    login,
    logout,
    loading,
  };
};
