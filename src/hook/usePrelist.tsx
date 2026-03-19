import { useState, useEffect } from "react";
import axiosClient from "../lib/axios-client";

// Type definitions based on the API response
interface Category {
  id: number;
  title: string;
  description: string | null;
  home_flag: number;
  status: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Journal {
  id: number;
  name: string;
  short_form: string;
}

interface Article {
  id: number;
  name: string;
}

interface Issue {
  id: number;
  name: string;
}

interface Processing {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
  colour: string;
}

interface PrelistData {
  journal_id: number;
  categories: Category[];
  journals: Journal[];
  articles: Article[];
  issues: Issue[];
  processings: Processing[];
  status: Status[];
}

interface PrelistResponse {
  status: string;
  message: string;
  data: PrelistData;
}

interface UseSubmissionPrelistReturn {
  data: PrelistData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSubmissionPrelist = (): UseSubmissionPrelistReturn => {
  const [data, setData] = useState<PrelistData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrelistData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axiosClient.get<PrelistResponse>(
        "/submission/prelist",
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      if (response.data.status === "success") {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch data");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load submission data";
      setError(errorMessage);
      console.error("Prelist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrelistData();
  }, []);

  const refetch = async () => {
    await fetchPrelistData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};

// Export types for use in components
export type {
  Category,
  Journal,
  Article,
  Issue,
  Processing,
  Status,
  PrelistData,
};