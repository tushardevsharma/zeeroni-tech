import React, { FC, useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "../auth/AuthContext";
import { usePartnerNotification } from "../hooks/usePartnerNotification";
import { uploadService } from "../services/uploadService";
import { useVideoCompression } from "../hooks/useVideoCompression";
import { DigitalManifestModal } from "./DigitalManifestModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import zeeroniLogo from "@/assets/zeeroni-logo.png";
import WebLayout from "@/components/layout/WebLayout"; // Ensure this is imported once at the top
import {
  SurveyUpload,
  GeminiAnalyzedItem,
  UploadStatus,
  AnalysisResultItem,
} from "../types"; // Assuming these types are defined

interface PartnerDashboardProps {}

// Extended SurveyUpload type to include client-side properties
interface ClientSurveyUpload extends SurveyUpload {
  progress: number;
  videoName: string;
}

const MAX_FILE_SIZE_MB = 100; // Max upload limit

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export const PartnerDashboard: FC<PartnerDashboardProps> = () => {
  const { logout: authLogout } = useAuth();
  const { showSuccess, showError, showInfo } = usePartnerNotification();
  const {
    getPresignedUrl,
    uploadFileToS3,
    processUpload,
    getUserUploads,
    getUploadStatus,
    getDigitalManifest,
    getVideoLink,
  } = uploadService();

  const { compressVideo, isCompressing, progress: compressionProgress } = useVideoCompression();

  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [uploads, setUploads] = useState<ClientSurveyUpload[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<
    AnalysisResultItem[] | null
  >(null);
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const [loadingManifestId, setLoadingManifestId] = useState<string | null>(null);

  // Video preview states
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);

  // Upload flow states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");

  // Polling state
  const uploadsToPoll = useRef<string[]>([]);
  const pollingIntervalRef = useRef<number | null>(null);

  const fetchUploads = useCallback(async () => {
    setIsLoadingUploads(true);
    try {
      const apiUploads: SurveyUpload[] = await getUserUploads();
      const newUploadsToPoll: string[] = [];
      const formattedUploads = apiUploads.map((apiUpload) => {
        const id = apiUpload.uploadId;
        const shortId = id.length > 8 ? `${id.slice(0, 4)}...${id.slice(-4)}` : id;
        if (
          apiUpload.status === "Pending" ||
          apiUpload.status === "Processing" ||
          apiUpload.status === "Queued"
        ) {
          newUploadsToPoll.push(apiUpload.uploadId);
        }
        return {
          ...apiUpload,
          progress:
            apiUpload.status === "Completed" || apiUpload.status === "Failed"
              ? 100
              : 0,
          videoName: apiUpload.fileName || `Video_${shortId}.mp4`,
        };
      });
      setUploads(formattedUploads);
      uploadsToPoll.current = newUploadsToPoll;
    } catch (error: any) {
      showError(error.message || "Failed to fetch uploads.");
    } finally {
      setIsLoadingUploads(false);
    }
  }, [getUserUploads, showError]);

  const pollUploadsStatus = useCallback(async () => {
    if (uploadsToPoll.current.length === 0) return;

    uploadsToPoll.current.forEach(async (uploadId) => {
      try {
        const apiUpload = await getUploadStatus(uploadId);
        setUploads((prevUploads) =>
          prevUploads.map((u) => {
            if (u.uploadId === apiUpload.uploadId && u.status !== apiUpload.status) {
              if (apiUpload.status === "Completed" || apiUpload.status === "Failed") {
                uploadsToPoll.current = uploadsToPoll.current.filter(
                  (id) => id !== uploadId,
                );
                showInfo(
                  `Upload status for ${apiUpload.fileName || u.videoName} is now ${apiUpload.status}.`,
                );
              }
              return { ...u, status: apiUpload.status, message: apiUpload.message };
            }
            return u;
          }),
        );
      } catch (error) {
        console.error(`Error polling status for ${uploadId}:`, error);
      }
    });
  }, [getUploadStatus, showInfo]);

  useEffect(() => {
    fetchUploads();
    // Start polling
    pollingIntervalRef.current = window.setInterval(pollUploadsStatus, 10000);

    return () => {
      // Cleanup polling on unmount
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchUploads, pollUploadsStatus]);

  const logout = useCallback(() => {
    authLogout();
    showInfo("You have been logged out.");
  }, [authLogout, showInfo]);

  const onFileSelected = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.type !== "video/mp4" && file.type !== "video/quicktime") {
        showError("Invalid file type. Only .mp4 and .mov files are accepted.");
        clearFileInput(event.target);
        return;
      }

      const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        showError(
          `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB.`,
        );
        clearFileInput(event.target);
        return;
      }

      setSelectedFile(file);
      setCustomFileName(""); // Don't auto-fill, let user enter manually
      setFilePreviewUrl(URL.createObjectURL(file));
    },
    [showError],
  );

  const clearFileInput = (input: HTMLInputElement | null) => {
    if (input) {
      input.value = "";
    }
  };

  const cancelSelection = useCallback(() => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setCustomFileName("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatusMessage("");
    // Clear the value of the file input fields
    if (fileUploadInputRef.current) clearFileInput(fileUploadInputRef.current);
    if (cameraInputRef.current) clearFileInput(cameraInputRef.current);
  }, []);

  const retryUpload = useCallback(
    async (uploadId: string) => {
      const upload = uploads.find((u) => u.uploadId === uploadId);
      if (!upload) {
        showError("Could not find the upload to retry.");
        return;
      }

      setUploads((prev) =>
        prev.map((u) =>
          u.uploadId === uploadId
            ? { ...u, status: "Pending", message: "Retrying processing..." }
            : u,
        ),
      );

      try {
        const response = await processUpload(uploadId);
        showSuccess(`Retry initiated for ${upload.videoName}.`);
        setUploads((prev) =>
          prev.map((u) =>
            u.uploadId === uploadId
              ? { ...u, status: response.status, message: response.message }
              : u,
          ),
        );
        if (
          (response.status === "Pending" ||
            response.status === "Processing" ||
            response.status === "Queued") &&
          !uploadsToPoll.current.includes(uploadId)
        ) {
          uploadsToPoll.current.push(uploadId);
        }
      } catch (error: any) {
        console.error(`Retry failed for ${uploadId}:`, error);
        showError(error.message || "Retry failed: Unknown error");
        setUploads((prev) =>
          prev.map((u) =>
            u.uploadId === uploadId
              ? { ...u, status: "Failed", message: error.message || "Retry failed: Unknown error" }
              : u,
          ),
        );
      }
    },
    [uploads, processUpload, showError, showSuccess],
  );

  const onUpload = useCallback(async () => {
    if (!selectedFile || !customFileName) {
      showError("Please select a file and provide a file name.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let finalFileName = customFileName;
    if (!customFileName.includes(".")) {
      const fileExtension =
        selectedFile.type === "video/quicktime" ? ".mov" : ".mp4";
      finalFileName = `${customFileName}${fileExtension}`;
    }

    try {
      // Step 1: Compress video before upload (only if > 50MB)
      const COMPRESSION_THRESHOLD = 50 * 1024 * 1024; // 50MB
      let fileToUpload: File;

      if (selectedFile.size > COMPRESSION_THRESHOLD) {
        setUploadStatusMessage("Compressing video...");
        try {
          const result = await compressVideo(selectedFile);
          fileToUpload = result.file;
          showSuccess(
            `Video compressed: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (${result.compressionRatio}% smaller)`
          );
        } catch (compressionError: any) {
          console.error("Video compression failed:", compressionError);
          showError("Video compression failed. Please try again or use a smaller file.");
          return;
        }
      } else {
        fileToUpload = selectedFile;
      }

      // Step 2: Get presigned URL
      setUploadStatusMessage("Requesting upload URL...");
      const presignedResponse = await getPresignedUrl(
        finalFileName,
        fileToUpload.type,
      );

      // Step 3: Upload to S3
      setUploadStatusMessage("Uploading video to secure storage...");
      await uploadFileToS3(presignedResponse.preSignedUrl, fileToUpload, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      setUploadProgress(100);
      setUploadStatusMessage("Finalizing upload...");

      await processUpload(presignedResponse.uploadId);

      showSuccess("Upload successful! Your video is now being processed.");
      cancelSelection();
      fetchUploads();
    } catch (error: any) {
      console.error("Upload failed:", error);
      showError(error.message || "Upload failed: Unknown error");
    } finally {
      setIsUploading(false);
    }
  }, [
    selectedFile,
    customFileName,
    showError,
    showSuccess,
    showInfo,
    compressVideo,
    getPresignedUrl,
    uploadFileToS3,
    processUpload,
    cancelSelection,
    fetchUploads,
  ]);


  const getStatusClass = useCallback((status: UploadStatus): string => {
    switch (status) {
      case "Pending":
      case "Processing":
        return "bg-amber-500 text-white"; // Better contrast for processing states
      case "Queued":
        return "bg-blue-500 text-white";
      case "Completed":
        return "bg-primary text-primary-foreground";
      case "Failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "";
    }
  }, []);

  const openDigitalManifest = useCallback(
    async (uploadId: string) => {
      setLoadingManifestId(uploadId);
      try {
        const manifest = await getDigitalManifest(uploadId);
        setSelectedManifest(manifest);
        setSelectedUploadId(uploadId);
        setIsModalOpen(true);
      } catch (error: any) {
        showError(error.message || "Failed to fetch digital manifest.");
      } finally {
        setLoadingManifestId(null);
      }
    },
    [getDigitalManifest, showError],
  );

  const closeDigitalManifest = useCallback(() => {
    setIsModalOpen(false);
    setSelectedManifest(null);
    setSelectedUploadId(null);
  }, []);

  const openVideoPreview = useCallback(
    async (uploadId: string) => {
      setLoadingPreviewId(uploadId);
      try {
        const response = await getVideoLink(uploadId);
        setPreviewVideoUrl(typeof response === 'string' ? response : response.link);
        setIsPreviewOpen(true);
      } catch (error: any) {
        showError(error.message || "Failed to load video preview.");
      } finally {
        setLoadingPreviewId(null);
      }
    },
    [getVideoLink, showError],
  );

  const closeVideoPreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewVideoUrl(null);
  }, []);

  return (
    <WebLayout> {/* Use WebLayout to include the shared Header */}
      <div className="mx-auto w-full max-w-6xl flex-grow p-6">
        <h2 className="mb-4 text-center text-3xl font-bold text-primary">
          Video Survey
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-muted-foreground">
          Upload a video of your household items to generate a comprehensive{" "}
          <b>digital manifest</b>.
          <br />
          Simply select a video file or record directly from your device.
        </p>

        {/* Upload Options Area */}
        <div className="mb-8 flex flex-wrap justify-center gap-5">
          <div
            className="flex min-w-[280px] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg"
            onClick={() => fileUploadInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileUploadInputRef}
              onChange={onFileSelected}
              hidden
              accept="video/*"
            />
            <p className="text-lg font-bold text-foreground">
              Upload a video file
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Only small files less than {MAX_FILE_SIZE_MB}MB are supported
            </p>
          </div>

          <div
            className="flex min-w-[280px] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg"
            onClick={() => cameraInputRef.current?.click()}
          >
            <input
              type="file"
              ref={cameraInputRef}
              onChange={onFileSelected}
              hidden
              accept="video/*"
              capture="environment"
            />
            <p className="text-lg font-bold text-foreground">Record directly</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Set your camera settings to a lower resolution (30 FPS, 480p-720p)
            </p>
          </div>
        </div>

        {/* New Upload Preview and Confirmation Section */}
        {selectedFile && (
          <div className="mb-8 rounded-lg border bg-card p-6 shadow-md">
            <h4 className="mb-6 text-center text-xl font-bold text-primary">
              Upload Confirmation
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:flex-1 md:min-w-[300px]">
                <video src={filePreviewUrl || ""} controls className="w-full max-w-full rounded-md bg-black"></video>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <div className="mb-5">
                  <Label htmlFor="customFileName" className="mb-2 block font-bold text-foreground">
                    File Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customFileName"
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder="Enter a name for your video (required)"
                    disabled={isUploading}
                    className={cn(
                      "w-full p-3 text-base",
                      !customFileName && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {!customFileName && (
                    <p className="mt-1 text-sm text-destructive">
                      Please enter a file name to enable upload
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 p-3 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={onUpload}
                    disabled={isUploading || !customFileName}
                  >
                    {isUploading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
                        Uploading...
                      </>
                    ) : (
                      "Confirm & Upload"
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 p-3 text-base font-bold bg-muted hover:bg-muted/80 text-muted-foreground"
                    onClick={cancelSelection}
                    disabled={isUploading || isCompressing}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
            {/* Compression Progress */}
            {isCompressing && (
              <div className="mt-6">
                <p className="mb-2 text-center font-bold text-foreground">
                  {compressionProgress.message}
                  <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-foreground border-r-transparent" />
                </p>
                <div className="h-3 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-400 ease-in-out"
                    style={{ width: `${compressionProgress.percent}%` }}
                  ></div>
                </div>
              </div>
            )}
            {/* Upload Status with Spinner */}
            {isUploading && !isCompressing && (
              <div className="mt-6">
                <p className="mb-2 text-center font-bold text-foreground">
                  {uploadStatusMessage}
                  <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-foreground border-r-transparent" />
                </p>
                <div className="h-3 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-400 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Survey List */}
        <div className="rounded-lg bg-card p-6 shadow-md">
          <h3 className="mb-5 border-b pb-3 text-xl font-bold text-primary">
            Recent Uploads
          </h3>
          {isLoadingUploads ? (
            <div className="flex flex-col items-center justify-center p-10 text-primary">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              <p className="mt-4 text-lg font-bold">Loading uploads...</p>
            </div>
          ) : (
            <>
              {uploads.length === 0 ? (
                <p className="p-5 text-center text-muted-foreground">
                  No uploads yet.
                </p>
              ) : (
                uploads.map((upload) => (
                  <div
                    key={upload.uploadId}
                    className="flex flex-wrap items-center justify-between gap-3 border-b py-4 last:border-b-0"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-foreground">
                        {upload.fileName || upload.videoName}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {format(new Date(upload.createdTimestamp), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    <div className="flex flex-col items-start min-w-[120px]">
                      {upload.status !== "Completed" && (
                        <span
                          className={cn(
                            "rounded-md px-2 py-1 text-xs font-bold uppercase",
                            getStatusClass(upload.status),
                          )}
                        >
                          {upload.status}
                          {(upload.status === "Pending" ||
                            upload.status === "Processing" ||
                            upload.status === "Queued") && (
                              <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                            )}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openVideoPreview(upload.uploadId)}
                        className="text-sm"
                        disabled={loadingPreviewId !== null}
                      >
                        {loadingPreviewId === upload.uploadId ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-foreground border-r-transparent" />
                            Loading...
                          </>
                        ) : (
                          'Preview Video'
                        )}
                      </Button>
                      {upload.status === "Completed" && (
                        <Button
                          onClick={() => openDigitalManifest(upload.uploadId)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                          disabled={loadingManifestId !== null}
                        >
                          {loadingManifestId === upload.uploadId ? (
                            <>
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
                              Loading...
                            </>
                          ) : (
                            'Get Digital Manifest'
                          )}
                        </Button>
                      )}
                      {upload.status === "Failed" && (
                        <Button
                          onClick={() => retryUpload(upload.uploadId)}
                          className="bg-accent hover:bg-accent/90 text-white text-sm"
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div> {/* This div closes the content that was inside main */}

      <Dialog open={isPreviewOpen} onOpenChange={(open) => !open && closeVideoPreview()}>
        <DialogContent className="max-w-3xl p-4">
          {previewVideoUrl && (
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full rounded-md bg-black"
              style={{ maxHeight: "75vh" }}
            />
          )}
        </DialogContent>
      </Dialog>

      <DigitalManifestModal
        manifestData={selectedManifest}
        isLoading={loadingManifestId !== null}
        isOpen={isModalOpen}
        onClose={closeDigitalManifest}
        uploadId={selectedUploadId}
        getVideoLink={getVideoLink}
      />
    </WebLayout>
  );
};