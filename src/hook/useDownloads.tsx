import { useState, useCallback } from "react";
import axiosClient from "../lib/axios-client";

export interface FinalCopyRightForm {
  id: number;
  article_id: number;
  doc_title: string;
  file_path: string;
  category: number;
  create_at: string;
  journal_short_form: string;
  file_url: string;
}

export interface Manuscript {
  id: number;
  category_id: number;
  writer_id: number;
  reviewer_id: number | null;
  title: string;
  description: string;
  image_path: string | null;
  file_path: string;
  video_id: number | null;
  start_date: string | null;
  end_date: string | null;
  upload_status: number;
  review_status: number;
  status: number;
  journal_type: number;
  journal_short_form: string;
  article_type: number;
  issue_type: number;
  processing_type: number;
  status_type: number;
  scheduled_on: string | null;
  notes: string | null;
  payment_status: string | null;
  freeze_data: number;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string | null;
  ref_id: string | null;
  country: string | null;
  file_url: string;
}

export interface DownloadsFilesResponse {
  status: string | boolean;
  files: string;
  final_copy_right_forms: FinalCopyRightForm[];
  manuscripts: Manuscript[];
}

export const useDownloadsFiles = () => {
  const [data, setData] = useState<DownloadsFilesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDownloadsFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || "";

      const response = await axiosClient.get<DownloadsFilesResponse>(
        "/downloadsFiles",
        {
          headers: { Authorization: token },
        }
      );

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Unable to fetch downloaded files list. Please try again.";

      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchDownloadsFiles,
    data,
    loading,
    error,
  };
};
