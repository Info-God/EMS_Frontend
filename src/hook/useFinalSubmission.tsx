// hooks/useFinalSubmission.ts
import { useState } from "react";
import axiosClient from "../lib/axios-client";
import type { FinalUploadResponse, FinalUploadParams, FinalEditParams } from "../types";
import { useAppSelector } from "../lib/store/store";
import toast from "react-hot-toast";

// import { updateFile } from "../lib/store/features/submission";

export const useFinalSubmission = () => {
  const { activePaperId } = useAppSelector((state) => state.global);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FinalUploadResponse | null>(null);

  const endpointMapper: Record<FinalUploadParams["type"], string> = {
    copyright: "/final-submission/copyright/" + (activePaperId || ""),
    payment: "/final-submission/payment/" + (activePaperId || ""),
    manuscript: "/final-submission/manuscript/" + (activePaperId || ""),
    file: "/author/upload-file/" + (activePaperId || ""),
    galley:"/author/upload-galley-file/"+(activePaperId||""),
    final_submission_freeze: "/final_submission_freeze/"+(activePaperId || "")
  };

  

  const uploadFinalDocument = async (params: FinalUploadParams) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", params.file);
      formData.append("file_name", params.file_name ?? params.file.name);
      formData.append("doc_title", params.file_name ?? params.file.name);
      if (params.type === "galley" && params.galley_file_id) {
        formData.append("galley_file_id", params.galley_file_id.toString());
      }
      if(params.comments){
        formData.append("comments",params.comments)
      }

      const apiPath = `${endpointMapper[params.type]}`;

      const response = await axiosClient.post<FinalUploadResponse>(
        apiPath,
        formData,
        {
          headers: {
            Authorization: token ?? "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Upload failed";
      setError(msg);
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFinalDocument,
    loading,
    error,
    data,
  };
};


export const useEditFinalSubmission = () => {
  const { activePaperId } = useAppSelector((state) => state.global);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FinalUploadResponse | null>(null);

  const endpointMapper: Record<FinalEditParams["type"], string> = {
    copyright: "/final-submission/copyright/edit/" + (activePaperId || ""),
    payment: "/final-submission/payment/edit/" + (activePaperId || ""),
    manuscript: "/final-submission/manuscript/edit/" + (activePaperId || ""),
    file: "/author/upload-file/edit/" + (activePaperId || ""),
    galley:"/author/upload-galley-file/"+(activePaperId||""),
    final_submission_freeze: "/final_submission_freeze/" + (activePaperId || "")

  };

  const editFinalDocument = async (params: FinalEditParams) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", params.file!);
      formData.append("file_name", params.doc_title ?? params.file!.name);
      formData.append("id", params.id.toString());
      if (params.type === "galley" && params.galley_file_id) {
        formData.append("galley_file_id", params.galley_file_id.toString());
      }
      if(params.comments){
        formData.append("comments",params.comments)
      }

      const apiPath = `${endpointMapper[params.type]}`;

      const response = await axiosClient.post<FinalUploadResponse>(
        apiPath,
        formData,
        {
          headers: {
            Authorization: token ?? "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Upload failed";
      setError(msg);
      // throw err;
    } finally {
      setLoading(false);
    }
  };


  return {
    editFinalDocument,
    loading,
    error,
    data,
  };
};
export const useFrizeFinalSubmission = () => {
  const { activePaperId } = useAppSelector((state) => state.global);
  // const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FinalUploadResponse | null>(null);

  const endpointMapper: Record<FinalEditParams["type"], string> = {
    copyright: "/final-submission/copyright/edit/" + (activePaperId || ""),
    payment: "/final-submission/payment/edit/" + (activePaperId || ""),
    manuscript: "/final-submission/manuscript/edit/" + (activePaperId || ""),
    file: "/author/upload-file/edit/" + (activePaperId || ""),
    galley:"/author/upload/galley-file/"+(activePaperId||""),
    final_submission_freeze: "/final-submission/freeze/"+(activePaperId || "") 
  };

  const frizeFinalDocument = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("freeze_data", "1");
      formData.append("id", id.toString());

      const apiPath = `${endpointMapper["final_submission_freeze"]}`;

      const response = await axiosClient.post<FinalUploadResponse>(
        apiPath,
        formData,
        {
          headers: {
            Authorization: token ?? "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setData(response.data);

      // Update the file in Redux store with freeze_data set to 1
      // const updatedFile: Partial<FileItem> = {
      //   id: id,
      //   freeze_data: 1,
      // };
      // dispatch(updateFile({ type: params.type, file: updatedFile as FileItem }));

      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Upload failed";
      setError(msg);
      toast.error(msg);
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    frizeFinalDocument,
    loading,
    error,
    data,
  };

};