// src/hooks/useArticleDetails.ts

import { useCallback, useState } from "react";
import axiosClient from "../lib/axios-client";
import { useDispatch } from "react-redux";
import { setArticlePayload, setError, setLoading } from "../lib/store/features/submission";
import type { ArticleState } from "../types";

export const useArticleDetails = () => {
  const dispatch = useDispatch();

  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [data, setData] = useState<ArticleState | null>(null);

  const fetchArticleDetails = useCallback(async (articleId: number | string) => {
    setLoadingLocal(true);
    setErrorLocal(null);
    dispatch(setLoading(true));

    try {
      const token = localStorage.getItem("token");

      const res = await axiosClient.get<ArticleState>(
        `/submission/viewDetails/${articleId}`,
        {
          headers: {
            Authorization: token || "",
          },
        }
      );
      //->console.log("article detials",res.data)
      setData(res.data);

      // Push to Redux
      dispatch(setArticlePayload(res.data));

      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Unable to fetch article details";

      setErrorLocal(msg);
      dispatch(setError(msg));

      // throw err;
    } finally {
      setLoadingLocal(false);
      dispatch(setLoading(false));
    }
  },[dispatch]);

  return {
    fetchArticleDetails,
    loading: loadingLocal,
    error: errorLocal,
    data,
  };
};
