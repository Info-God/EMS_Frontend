import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";
import { type UserType } from "../lib/store/features/authSlice";

interface ProfileResponse {
    status: boolean;
    message: string;
    data: UpdateProfilePayload;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface UpdateResponse {
  status: boolean;
  message: string;
  data: UserType;
}

export const useFetchProfile = () => {
//   const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UpdateProfilePayload | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      const res = await axiosClient.get<ProfileResponse>("/profile", {
        headers: { Authorization: token },
      });

      const user = res.data.data;

      setData(user);

      return user;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to fetch profile");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchProfile, loading, error, data };
};


export const useUpdateProfile = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem("token") || "";

        const res = await axiosClient.post<UpdateResponse>(
          "/profile/update",
          payload,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        const updatedUser = res.data;

        if (updatedUser) {
          setSuccess(updatedUser.status);
        }
        return payload;
      } catch (err: any) {
        setError(err?.response?.data?.message || "Profile update failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateProfile, loading, success, error };
};