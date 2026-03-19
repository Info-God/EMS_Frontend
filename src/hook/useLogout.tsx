import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";
import { useAppDispatch, useAppSelector } from "../lib/store/store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface LogoutResponse {
  message?: string;
  status?: boolean;
  [key: string]: any;
}

export const useLogout = () => {
  const [data, setData] = useState<LogoutResponse | null>(null);
  const navigate = useNavigate();
  const { active } = useAppSelector((state) => state.journal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const garbageClear = useCallback(() => {
    navigate(`/?journal=${active?.id ?? "1"}`);
    localStorage.removeItem("token")
    localStorage.removeItem("user_id");
    sessionStorage.clear();
    // clear store
    dispatch({ type: 'auth/logout' });
    setLoading(false);

  }, [active?.id, dispatch, navigate]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") ?? "";
      const res = await axiosClient.post<LogoutResponse>(
        "/logout",
        {},
        {
          headers: {
            Authorization: token,
          },
          withCredentials: true,
        }
      );
      toast.success("Logout Successful")
      setData(res.data);
      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Logout failed. Please try again.";

      setError(msg);
      // throw err;
    } finally {
      garbageClear();
    }
  }, [garbageClear]);

  return {
    logout,
    garbageClear,
    data,
    loading,
    error,
  };
};
