import React, { FC, useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMoveService } from "../services/moveService";
import { MoveRoom, ItemStatus } from "../types";
import { uploadService } from "@/features/partner/services/uploadService";
import { useVideoCompression } from "@/features/partner/hooks/useVideoCompression";
import type { AnalysisResultItem } from "@/features/partner/types";
import WebLayout from "@/components/layout/WebLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Video, Upload, CheckCircle2, Loader2, Package, ShieldCheck, Gem, Eye, Trash2, Mic,
} from "lucide-react";

const PROCESSING_MESSAGES = [
  "Looking for your furniture…",
  "Found a few things! Measuring them now…",
  "Estimating how many boxes you'll need…",
  "Double-checking the fragile items…",
  "Preparing your zero-touch inventory…",
];

const MAX_FILE_SIZE_MB = 100;

export const RoomDetail: FC = () => {
  const { moveId, houseId, roomId } = useParams<{ moveId: string; houseId: string; roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const moveService = useMoveService();
  const {
    getPresignedUrl,
    uploadFileToS3,
    processUpload,
    getUploadStatus,
    getDigitalManifest,
  } = uploadService();
  const { compressVideo, isCompressing, progress: compressionProgress } = useVideoCompression();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [room, setRoom] = useState<MoveRoom | null>(null);
  const [items, setItems] = useState<ItemStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload flow (same as partner)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);
  const [currentUploadStatus, setCurrentUploadStatus] = useState<string | null>(null);
  const [processingMsgIndex, setProcessingMsgIndex] = useState(0);

  // Analysis review dialog
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [analysisItems, setAnalysisItems] = useState<AnalysisResultItem[]>([]);
  const [selectedAnalysisIds, setSelectedAnalysisIds] = useState<Set<string>>(new Set());
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!houseId || !roomId) return;
    setLoading(true);
    try {
      const [allRooms, allItems] = await Promise.all([
        moveService.getRooms(houseId),
        moveService.getItems(roomId),
      ]);
      setRoom(allRooms.find((r) => r.id === roomId) || null);
      setItems(allItems);
    } finally {
      setLoading(false);
    }
  }, [houseId, roomId, moveService]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Poll upload status when we have an in-progress upload
  useEffect(() => {
    if (!currentUploadId || !currentUploadStatus) return;
    if (currentUploadStatus === "Completed" || currentUploadStatus === "Failed") return;

    const interval = setInterval(async () => {
      try {
        const api = await getUploadStatus(currentUploadId);
        setCurrentUploadStatus(api.status);
      } catch {
        // ignore
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [currentUploadId, currentUploadStatus, getUploadStatus]);

  // Cycle processing message while upload is processing
  useEffect(() => {
    if (currentUploadStatus !== "Pending" && currentUploadStatus !== "Processing" && currentUploadStatus !== "Queued") return;
    const interval = setInterval(() => {
      setProcessingMsgIndex((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentUploadStatus]);

  const onFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "video/mp4" && file.type !== "video/quicktime") {
      toast({ description: "Only .mp4 and .mov files are accepted.", variant: "destructive" });
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast({ description: `File must be under ${MAX_FILE_SIZE_MB}MB.`, variant: "destructive" });
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
    setCustomFileName("");
    setFilePreviewUrl(URL.createObjectURL(file));
  }, [toast]);

  const cancelSelection = useCallback(() => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setCustomFileName("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatusMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const onUpload = useCallback(async () => {
    if (!selectedFile || !customFileName || !roomId) return;

    setIsUploading(true);
    setUploadProgress(0);
    let finalFileName = customFileName;
    if (!customFileName.includes(".")) {
      finalFileName = `${customFileName}${selectedFile.type === "video/quicktime" ? ".mov" : ".mp4"}`;
    }

    try {
      const COMPRESSION_THRESHOLD = 50 * 1024 * 1024;
      let fileToUpload: File = selectedFile;

      if (selectedFile.size > COMPRESSION_THRESHOLD) {
        setUploadStatusMessage("Compressing video...");
        const result = await compressVideo(selectedFile);
        fileToUpload = result.file;
      }

      setUploadStatusMessage("Requesting upload URL...");
      const presignedResponse = await getPresignedUrl(finalFileName, fileToUpload.type);

      setUploadStatusMessage("Uploading video...");
      await uploadFileToS3(presignedResponse.preSignedUrl, fileToUpload, (p) => setUploadProgress(Math.round(p)));

      setUploadProgress(100);
      setUploadStatusMessage("Starting AI analysis...");
      const processResponse = await processUpload(presignedResponse.uploadId);

      setCurrentUploadId(presignedResponse.uploadId);
      setCurrentUploadStatus(processResponse.status);
      toast({ description: "Upload complete. AI is processing your video." });
      cancelSelection();
    } catch (err: unknown) {
      toast({ description: err instanceof Error ? err.message : "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, customFileName, roomId, compressVideo, getPresignedUrl, uploadFileToS3, processUpload, cancelSelection, toast]);

  const openAnalysisDialog = useCallback(async () => {
    if (!currentUploadId) return;
    setLoadingAnalysis(true);
    try {
      const manifest = await getDigitalManifest(currentUploadId);
      setAnalysisItems(manifest);
      setSelectedAnalysisIds(new Set(manifest.map((i) => i.id)));
      setShowAnalysisDialog(true);
    } catch {
      toast({ description: "Failed to load analysis results.", variant: "destructive" });
    } finally {
      setLoadingAnalysis(false);
    }
  }, [currentUploadId, getDigitalManifest, toast]);

  const toggleAnalysisItem = useCallback((id: string) => {
    setSelectedAnalysisIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAllAnalysis = useCallback(() => {
    setSelectedAnalysisIds(new Set(analysisItems.map((i) => i.id)));
  }, [analysisItems]);

  const deselectAllAnalysis = useCallback(() => {
    setSelectedAnalysisIds(new Set());
  }, []);

  const confirmImport = useCallback(async () => {
    if (!roomId || selectedAnalysisIds.size === 0) return;
    setImporting(true);
    try {
      await moveService.createItemStatusesBulk(
        Array.from(selectedAnalysisIds).map((inventoryItemId) => ({
          inventoryItemId,
          currentRoomId: roomId,
          isPacked: false,
          packedAt: null,
          isHighValue: false,
          isFragile: false,
          packedByUserId: "",
        })),
      );
      toast({ description: `${selectedAnalysisIds.size} items added to this room.` });
      setShowAnalysisDialog(false);
      setAnalysisItems([]);
      setSelectedAnalysisIds(new Set());
      setCurrentUploadId(null);
      setCurrentUploadStatus(null);
      fetchData();
    } catch {
      toast({ description: "Failed to add items.", variant: "destructive" });
    } finally {
      setImporting(false);
    }
  }, [roomId, selectedAnalysisIds, moveService, toast, fetchData]);

  const handleDeleteItem = useCallback(async (id: string) => {
    setDeletingItemId(id);
    try {
      await moveService.deleteItem(id);
      toast({ description: "Item removed" });
      fetchData();
    } finally {
      setDeletingItemId(null);
    }
  }, [moveService, toast, fetchData]);

  if (loading) {
    return (
      <WebLayout>
        <div className="flex items-center justify-center p-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        </div>
      </WebLayout>
    );
  }

  if (!room) {
    return (
      <WebLayout>
        <div className="p-10 text-center">
          <p className="text-muted-foreground">Room not found.</p>
          <Button variant="outline" onClick={() => navigate(`/moves/${moveId}/houses/${houseId}`)} className="mt-4">Back</Button>
        </div>
      </WebLayout>
    );
  }

  const isProcessing = currentUploadStatus === "Pending" || currentUploadStatus === "Processing" || currentUploadStatus === "Queued";
  const isCompleted = currentUploadStatus === "Completed";

  return (
    <WebLayout>
      <div className="mx-auto w-full max-w-6xl flex-grow p-4 sm:p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/moves/${moveId}/houses/${houseId}`)} className="mb-4 gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to House
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{room.name}</h1>
          {room.notes && <p className="text-sm text-muted-foreground mt-1">{room.notes}</p>}
        </div>

        {/* Video Upload & AI Analysis */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="rounded-lg bg-primary/10 p-2.5 mt-0.5">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">AI Video Analysis</h2>
                  <p className="text-sm text-muted-foreground">Upload a walkthrough video of this room. Our AI will detect and catalog every item automatically.</p>
                </div>
              </div>

              <div className="rounded-lg bg-background border border-primary/20 p-4 flex items-start gap-3 mb-4">
                <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Pro tip: Narrate as you film</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Our AI analyzes both <strong>visual</strong> and <strong>audio</strong> cues. Mention item names, conditions, or special notes while recording for a more accurate inventory.
                  </p>
                </div>
              </div>

              {/* Upload: file picker or confirmation */}
              {!selectedFile ? (
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={onFileSelected}
                  />
                  <p className="text-lg font-bold text-foreground">Upload a video file</p>
                  <p className="mt-1 text-sm text-muted-foreground">MP4 or MOV, max {MAX_FILE_SIZE_MB}MB</p>
                </div>
              ) : (
                <div className="rounded-lg border bg-card p-6 space-y-4">
                  <h4 className="font-semibold text-primary">Confirm upload</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <video src={filePreviewUrl ?? ""} controls className="w-full max-w-full rounded-md bg-black" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>File name (required)</Label>
                        <Input
                          value={customFileName}
                          onChange={(e) => setCustomFileName(e.target.value)}
                          placeholder="e.g. Living room walkthrough"
                          disabled={isUploading}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={onUpload}
                          disabled={isUploading || isCompressing || !customFileName.trim()}
                          className="gap-2"
                        >
                          {isUploading || isCompressing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {isCompressing ? compressionProgress?.message ?? "Compressing..." : uploadStatusMessage}
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" /> Confirm & Upload
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={cancelSelection} disabled={isUploading || isCompressing}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                  {(isUploading || isCompressing) && (
                    <Progress value={isCompressing ? compressionProgress?.percent : uploadProgress} className="h-2" />
                  )}
                </div>
              )}

              {/* Status after upload: processing or "Get analysis results" */}
              {currentUploadId && isProcessing && (
                <div className="mt-4 space-y-2">
                  <Progress value={50} className="h-2" />
                  <p className="text-sm text-primary font-medium italic animate-pulse">
                    {PROCESSING_MESSAGES[processingMsgIndex]}
                  </p>
                </div>
              )}
              {currentUploadId && isCompleted && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">Analysis complete.</span>
                  <Button size="sm" onClick={openAnalysisDialog} disabled={loadingAnalysis} className="gap-1.5">
                    {loadingAnalysis ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Get analysis results
                  </Button>
                </div>
              )}
            </CardContent>
          </div>
        </Card>

        {/* Items Table */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Items ({items.length})
          </h2>
        </div>

        {items.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No items yet. Upload a video and confirm analysis to add items.</CardContent></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Packed</TableHead>
                    <TableHead>High Value</TableHead>
                    <TableHead>Fragile</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.itemName || item.inventoryItemId}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.inventoryItemId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.isPacked ? (
                          <Badge className="bg-green-500/10 text-green-700 border-green-200" variant="outline">Packed</Badge>
                        ) : (
                          <Badge variant="secondary">Not Packed</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.isHighValue && <Gem className="h-4 w-4 text-amber-500" />}
                      </TableCell>
                      <TableCell>
                        {item.isFragile && <ShieldCheck className="h-4 w-4 text-destructive" />}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate(`/moves/${moveId}/items/${item.id}`)}>
                            <Eye className="h-3.5 w-3.5" /> Details
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteItem(item.id)} loading={deletingItemId === item.id}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Analysis review dialog */}
        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Review items to add to this room</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Select the items you want to add. They will be created in this room.
            </p>
            <div className="flex gap-2 my-2">
              <Button variant="outline" size="sm" onClick={selectAllAnalysis}>Select all</Button>
              <Button variant="outline" size="sm" onClick={deselectAllAnalysis}>Deselect all</Button>
            </div>
            <div className="overflow-auto flex-1 border rounded-md p-2 space-y-2">
              {analysisItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded border p-2">
                  <Checkbox
                    checked={selectedAnalysisIds.has(item.id)}
                    onCheckedChange={() => toggleAnalysisItem(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.itemName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.itemQuantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAnalysisDialog(false)}>Cancel</Button>
              <Button onClick={confirmImport} disabled={selectedAnalysisIds.size === 0} loading={importing}>
                Add {selectedAnalysisIds.size} item(s) to room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WebLayout>
  );
};
