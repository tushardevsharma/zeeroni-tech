import React, { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMoveService } from "../services/moveService";
import { ItemStatus, ItemQualityControl, ItemPhoto } from "../types";
import WebLayout from "@/components/layout/WebLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Package, ShieldCheck, Gem, ChevronDown, Brain, Camera, Star, Trash2, Plus, ImageIcon, Loader2,
} from "lucide-react";

export const ItemDetail: FC = () => {
  const { moveId, itemId } = useParams<{ moveId: string; itemId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const moveService = useMoveService();
  const [item, setItem] = useState<ItemStatus | null>(null);
  const [qc, setQc] = useState<ItemQualityControl | null>(null);
  const [photos, setPhotos] = useState<ItemPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [qcOpen, setQcOpen] = useState(true);
  const [photosOpen, setPhotosOpen] = useState(true);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoType, setNewPhotoType] = useState<"before" | "after" | "damage">("before");
  const [actionLoading, setActionLoading] = useState<"packed" | "highValue" | "fragile" | null>(null);
  const [addingPhoto, setAddingPhoto] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!itemId) return;
    setLoading(true);
    const foundItem = await moveService.getItem(itemId);
    setItem(foundItem || null);
    if (foundItem) {
      const [qcData, photoData] = await Promise.all([
        moveService.getQC(foundItem.inventoryItemId),
        moveService.getPhotos(foundItem.inventoryItemId),
      ]);
      setQc(qcData || null);
      setPhotos(photoData);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [itemId]);

  const togglePacked = async () => {
    if (!item) return;
    setActionLoading("packed");
    try {
      await moveService.updateItem(item.id, {
        isPacked: !item.isPacked,
        packedAt: !item.isPacked ? new Date().toISOString() : undefined,
      });
      toast({ description: item.isPacked ? "Marked as not packed" : "Marked as packed!" });
      fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const toggleHighValue = async () => {
    if (!item) return;
    setActionLoading("highValue");
    try {
      await moveService.updateItem(item.id, { isHighValue: !item.isHighValue });
      fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const toggleFragile = async () => {
    if (!item) return;
    setActionLoading("fragile");
    try {
      await moveService.updateItem(item.id, { isFragile: !item.isFragile });
      fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddPhoto = async () => {
    if (!item || !newPhotoUrl) return;
    setAddingPhoto(true);
    try {
      await moveService.addPhoto({
        inventoryItemId: item.inventoryItemId,
        photoUrl: newPhotoUrl,
        photoType: newPhotoType,
        capturedBy: "Admin",
      });
      toast({ description: "Photo added!" });
      setShowPhotoDialog(false);
      setNewPhotoUrl("");
      fetchData();
    } finally {
      setAddingPhoto(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    setDeletingPhotoId(id);
    try {
      await moveService.deletePhoto(id);
      toast({ description: "Photo removed" });
      fetchData();
    } finally {
      setDeletingPhotoId(null);
    }
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

  if (!item) {
    return (
      <WebLayout>
        <div className="p-10 text-center">
          <p className="text-muted-foreground">Item not found.</p>
          <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </WebLayout>
    );
  }

  return (
    <WebLayout>
      <div className="mx-auto w-full max-w-4xl flex-grow p-4 sm:p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{item.itemName}</h1>
              <p className="text-sm text-muted-foreground font-mono">{item.inventoryItemId}</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Item Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={cn("flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors", actionLoading === "packed" && "pointer-events-none opacity-90")} onClick={togglePacked}>
                {actionLoading === "packed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Checkbox checked={item.isPacked} />}
                <div>
                  <p className="font-medium text-sm">Packed</p>
                  {item.isPacked && item.packedAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.packedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className={cn("flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors", actionLoading === "highValue" && "pointer-events-none opacity-90")} onClick={toggleHighValue}>
                {actionLoading === "highValue" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Checkbox checked={item.isHighValue} />}
                <div className="flex items-center gap-1.5">
                  <Gem className="h-4 w-4 text-amber-500" />
                  <p className="font-medium text-sm">High Value</p>
                </div>
              </div>
              <div className={cn("flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors", actionLoading === "fragile" && "pointer-events-none opacity-90")} onClick={toggleFragile}>
                {actionLoading === "fragile" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Checkbox checked={item.isFragile} />}
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-destructive" />
                  <p className="font-medium text-sm">Fragile</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Control */}
        <Collapsible open={qcOpen} onOpenChange={setQcOpen} className="mb-6">
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" /> Quality Control
                  </CardTitle>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${qcOpen ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {qc ? (
                  <div className="space-y-4">
                    {qc.aiPackagingSuggestion && (
                      <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                        <p className="text-xs text-muted-foreground mb-1">AI Packaging Suggestion</p>
                        <p className="text-sm font-medium">{qc.aiPackagingSuggestion}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {qc.aiQualityScore !== undefined && (
                        <div className="rounded-lg border p-4">
                          <p className="text-xs text-muted-foreground">AI Quality Score</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 text-amber-500" />
                            <p className="text-xl font-bold">{qc.aiQualityScore}/100</p>
                          </div>
                        </div>
                      )}
                      {qc.captainVerdict && (
                        <div className="rounded-lg border p-4">
                          <p className="text-xs text-muted-foreground">Captain Verdict</p>
                          <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-700 border-green-200">
                            {qc.captainVerdict}
                          </Badge>
                        </div>
                      )}
                    </div>
                    {qc.captainNotes && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground mb-1">Captain Notes</p>
                        <p className="text-sm">{qc.captainNotes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No quality control data yet.</p>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Photos */}
        <Collapsible open={photosOpen} onOpenChange={setPhotosOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" /> Photos ({photos.length})
                  </CardTitle>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${photosOpen ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <Button size="sm" variant="outline" onClick={() => setShowPhotoDialog(true)} className="gap-1.5 mb-4">
                  <Plus className="h-4 w-4" /> Add Photo
                </Button>
                {photos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No photos yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="group relative rounded-lg border overflow-hidden">
                        <img src={photo.photoUrl} alt={photo.photoType} className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="ghost" size="sm" className="text-white" onClick={() => handleDeletePhoto(photo.id)} loading={deletingPhotoId === photo.id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-2">
                          <Badge variant="secondary" className="text-xs">{photo.photoType}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{photo.capturedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Add Photo Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Photo</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Photo URL</Label>
                <Input value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-2">
                  {(["before", "after", "damage"] as const).map((t) => (
                    <Button key={t} variant={newPhotoType === t ? "default" : "outline"} size="sm" onClick={() => setNewPhotoType(t)} className="capitalize">
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>Cancel</Button>
              <Button onClick={handleAddPhoto} loading={addingPhoto}>Add Photo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WebLayout>
  );
};
