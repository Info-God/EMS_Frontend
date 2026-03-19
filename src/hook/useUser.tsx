import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";
import { useAppDispatch } from "../lib/store/store";
import { logout, type UserType } from "../lib/store/features/authSlice";
import { clearUser, setUser } from "../lib/store/features/userSlice";

export const useUser = () => {
  const dispatch = useAppDispatch();

  /* ------------------ LOCAL STATE CONTRACT ------------------ */
  const [user, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------ CORE ORCHESTRATION ------------------ */
  const fetchUser = useCallback(async (): Promise<UserType | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      /* ---------- AUTH GUARD ---------- */
      if (!token) {
        dispatch(logout());
        dispatch(clearUser());
        return null;
      }

      const { data } = await axiosClient.get<UserType>("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      /* ---------- STATE SYNC ---------- */
      dispatch(setUser(data));
      setUserData(data);
      return data;
    } catch (err: any) {
      /* ---------- FAILURE PATH ---------- */
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to fetch user profile";

      setError(message);

      if (err?.response?.status === 401) {
        dispatch(logout());
      }

      dispatch(clearUser());
      setUserData(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    fetchUser,
    user,
    loading,
    error,
  };
};
