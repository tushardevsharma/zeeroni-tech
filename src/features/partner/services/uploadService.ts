import { useAuth } from "../auth/AuthContext";
import {
  PresignedUrlResponse,
  ProcessUploadResponse,
} from "../types"; // Assuming these types are defined in types/index.ts

export const uploadService = () => {
  const { getToken } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

  const getHeaders = (contentType = "application/json") => {
    const token = getToken();
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    return headers;
  };

  const getPresignedUrl = async (
    fileName: string,
    contentType: string
  ): Promise<PresignedUrlResponse> => {
    const response = await fetch(`${API_BASE_URL}/survey/presigned-url`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ fileName, contentType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get presigned URL");
    }
    return response.json();
  };

  const uploadFileToS3 = async (
    presignedUrl: string,
    file: File,
    onUploadProgress?: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onUploadProgress?.(percentComplete);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`Failed to upload to S3: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during S3 upload."));
      };

      xhr.send(file);
    });
  };

  const processUpload = async (
    uploadId: string
  ): Promise<ProcessUploadResponse> => {
    const response = await fetch(`${API_BASE_URL}/survey/process-upload`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ uploadId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process upload");
    }
    return response.json();
  };

  const getUserUploads = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/uploads/user`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user uploads");
    }
    return response.json();
  };

  const getUploadStatus = async (
    uploadId: string
  ): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/survey/upload/status/${uploadId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch upload status");
    }
    return response.json();
  };

  const getDigitalManifest = async (
    uploadId: string
  ): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/uploads/${uploadId}/analysis`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch digital manifest");
    }
    return response.json();
  };

  return {
    getPresignedUrl,
    uploadFileToS3,
    processUpload,
    getUserUploads,
    getUploadStatus,
    getDigitalManifest,
  };
};