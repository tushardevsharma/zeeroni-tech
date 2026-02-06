import { useState, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export interface CompressionProgress {
  stage: "loading" | "compressing" | "done" | "error";
  percent: number;
  message: string;
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export function useVideoCompression() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<CompressionProgress>({
    stage: "done",
    percent: 0,
    message: "",
  });

  const loadFFmpeg = useCallback(async (): Promise<FFmpeg> => {
    if (ffmpegRef.current?.loaded) {
      return ffmpegRef.current;
    }

    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    ffmpeg.on("progress", ({ progress: p }) => {
      const percent = Math.round(Math.max(0, Math.min(100, p * 100)));
      setProgress({
        stage: "compressing",
        percent,
        message: `Compressing video... ${percent}%`,
      });
    });

    ffmpeg.on("log", ({ message }) => {
      console.debug("[FFmpeg]", message);
    });

    setProgress({
      stage: "loading",
      percent: 0,
      message: "Loading compression engine...",
    });

    // Load single-threaded core — Vite requires ESM (not UMD)
    const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    return ffmpeg;
  }, []);

  const compressVideo = useCallback(
    async (file: File): Promise<CompressionResult> => {
      setIsCompressing(true);

      try {
        const ffmpeg = await loadFFmpeg();

        const inputName = "input" + getExtension(file.name);
        const outputName = "output.mp4";

        setProgress({
          stage: "compressing",
          percent: 0,
          message: "Preparing video for compression...",
        });

        // Write input file to FFmpeg virtual filesystem
        const fileData = await fetchFile(file);
        await ffmpeg.writeFile(inputName, fileData);

        // Fast browser compression settings:
        // - Scale to 480p max (faster encode than 720p)
        // - H.264 codec for universal compatibility
        // - CRF 32 for speed-optimized quality/size balance
        // - ultrafast preset for maximum browser speed
        // - AAC audio at 96k
        await ffmpeg.exec([
          "-i", inputName,
          "-vf", "scale=-2:480",
          "-c:v", "libx264",
          "-crf", "32",
          "-preset", "ultrafast",
          "-tune", "fastdecode",
          "-c:a", "aac",
          "-b:a", "96k",
          "-movflags", "+faststart",
          "-y", outputName,
        ]);

        // Read the compressed output
        const outputData = await ffmpeg.readFile(outputName);
        const outputBytes = outputData instanceof Uint8Array
          ? new Uint8Array(outputData)
          : new TextEncoder().encode(outputData as string);
        const compressedBlob = new Blob([outputBytes], { type: "video/mp4" });

        // Build a new File with the original name (but .mp4 extension)
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const compressedFile = new File(
          [compressedBlob],
          `${baseName}.mp4`,
          { type: "video/mp4" }
        );

        // Cleanup virtual filesystem
        try {
          await ffmpeg.deleteFile(inputName);
          await ffmpeg.deleteFile(outputName);
        } catch {
          // Ignore cleanup errors
        }

        const result: CompressionResult = {
          file: compressedFile,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio: Math.round(
            (1 - compressedFile.size / file.size) * 100
          ),
        };

        setProgress({
          stage: "done",
          percent: 100,
          message: `Compressed: ${formatBytes(file.size)} → ${formatBytes(compressedFile.size)} (${result.compressionRatio}% smaller)`,
        });

        return result;
      } catch (error: any) {
        console.error("Video compression failed:", error);
        setProgress({
          stage: "error",
          percent: 0,
          message: error.message || "Compression failed",
        });
        throw error;
      } finally {
        setIsCompressing(false);
      }
    },
    [loadFFmpeg]
  );

  return { compressVideo, isCompressing, progress };
}

function getExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : ".mp4";
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
