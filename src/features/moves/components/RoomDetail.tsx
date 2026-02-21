import React, { FC, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { moveService } from "../services/moveService";
import { MoveRoom, ItemStatus } from "../types";
import WebLayout from "@/components/layout/WebLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
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

export const RoomDetail: FC = () => {
  const { moveId, houseId, roomId } = useParams<{ moveId: string; houseId: string; roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<MoveRoom | null>(null);
  const [items, setItems] = useState<ItemStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchData = useCallback(async () => {
    if (!houseId || !roomId) return;
    setLoading(true);
    const [allRooms, allItems] = await Promise.all([
      moveService.getRooms(houseId),
      moveService.getItems(roomId),
    ]);
    setRoom(allRooms.find((r) => r.id === roomId) || null);
    setItems(allItems);
    setLoading(false);
  }, [houseId, roomId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Cycle processing messages
  useEffect(() => {
    if (!analysisRunning) return;
    const interval = setInterval(() => {
      setProcessingMsg((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [analysisRunning]);

  const handleVideoUpload = async () => {
    if (!roomId) return;
    setAnalysisRunning(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        return p + Math.random() * 15;
      });
    }, 400);

    try {
      await moveService.triggerVideoAnalysis(roomId);
      toast({ description: "Video analysis complete! Items detected and added." });
    } catch {
      toast({ description: "Video analysis failed", variant: "destructive" });
    } finally {
      clearInterval(progressInterval);
      setAnalysisRunning(false);
      setUploadProgress(0);
      fetchData();
    }
  };

  const handleDeleteItem = async (id: string) => {
    await moveService.deleteItem(id);
    toast({ description: "Item removed" });
    fetchData();
  };

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

              {/* Nudge */}
              <div className="rounded-lg bg-background border border-primary/20 p-4 flex items-start gap-3 mb-4">
                <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">🎙️ Pro tip: Narrate as you film</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Our AI analyzes both <strong>visual</strong> and <strong>audio</strong> cues. Mention item names, conditions, or special notes while recording for a more accurate inventory.
                  </p>
                </div>
              </div>

              {analysisRunning ? (
                <div className="space-y-3">
                  <Progress value={Math.min(uploadProgress, 100)} className="h-2" />
                  <p className="text-sm text-primary font-medium italic animate-pulse">{PROCESSING_MESSAGES[processingMsg]}</p>
                </div>
              ) : (
                <Button onClick={handleVideoUpload} className="gap-2">
                  <Upload className="h-4 w-4" /> Upload & Analyze Video
                </Button>
              )}

              {room.videoAnalysisStatus === "completed" && room.detectedItemsCount && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{room.detectedItemsCount} items detected and imported</span>
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
          <Card><CardContent className="p-8 text-center text-muted-foreground">No items yet. Upload a video to auto-detect items.</CardContent></Card>
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
                          <p className="font-medium">{item.itemName}</p>
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
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteItem(item.id)}>
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
      </div>
    </WebLayout>
  );
};
