import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { X, Package, Play, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AnalysisResultItem,
} from "../types";

type VolumeUnit = "m3" | "ft3";
const M3_TO_FT3 = 35.3147;
const VIDEO_LINK_DURATION_MINUTES = 5;
const REFRESH_BUFFER_SECONDS = 30; // Refresh 30 seconds before expiry

interface DigitalManifestModalProps {
  manifestData: AnalysisResultItem[] | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  uploadId: string | null;
  getVideoLink: (uploadId: string, durationInMinutes?: number) => Promise<{ link: string }>;
}

interface AggregatedMaterial {
  materialName: string;
  totalQuantity: number;
  unitId: string;
}

// Video Preview Component
const VideoPreview: FC<{
  uploadId: string;
  getVideoLink: (uploadId: string, durationInMinutes?: number) => Promise<{ link: string }>;
}> = ({ uploadId, getVideoLink }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchVideoLink = useCallback(async () => {
    if (!uploadId) return;
    
    setIsLoadingVideo(true);
    setVideoError(null);
    
    try {
      const response = await getVideoLink(uploadId, VIDEO_LINK_DURATION_MINUTES);
      setVideoUrl(response.link);
      
      // Schedule refresh before expiry
      const refreshMs = (VIDEO_LINK_DURATION_MINUTES * 60 - REFRESH_BUFFER_SECONDS) * 1000;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(() => {
        fetchVideoLink();
      }, refreshMs);
    } catch (error: any) {
      console.error("Failed to fetch video link:", error);
      setVideoError(error.message || "Failed to load video");
    } finally {
      setIsLoadingVideo(false);
    }
  }, [uploadId, getVideoLink]);

  useEffect(() => {
    fetchVideoLink();
    
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [fetchVideoLink]);

  if (isLoadingVideo && !videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Loading video...</p>
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-destructive/10 p-8">
        <p className="text-sm text-destructive">{videoError}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={fetchVideoLink}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-black overflow-hidden">
      <AspectRatio ratio={9 / 16}>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="h-full w-full object-contain"
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </AspectRatio>
    </div>
  );
};

// Manifest Content Component
const ManifestContent: FC<{
  manifestData: AnalysisResultItem[] | null;
  selectedIndices: Set<number>;
  toggleItem: (index: number) => void;
  toggleAll: () => void;
  allSelected: boolean;
  itemCount: number;
  formatVolume: (volumeM3: number) => string;
  volumeLabel: string;
}> = ({
  manifestData,
  selectedIndices,
  toggleItem,
  toggleAll,
  allSelected,
  itemCount,
  formatVolume,
  volumeLabel,
}) => {
  if (!manifestData || manifestData.length === 0) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        No digital manifest data available.
      </div>
    );
  }

  return (
    <>
      {/* Select All */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3">
        <Checkbox
          checked={allSelected}
          onCheckedChange={toggleAll}
          id="select-all-items"
        />
        <label
          htmlFor="select-all-items"
          className="text-sm font-semibold text-foreground cursor-pointer select-none"
        >
          Select All ({selectedIndices.size}/{itemCount})
        </label>
      </div>

      {manifestData.map((item, index) => {
        const isSelected = selectedIndices.has(index);
        return (
          <div
            key={index}
            className={cn(
              "mb-5 rounded-lg border bg-card p-5 shadow-sm transition-opacity",
              !isSelected && "opacity-50"
            )}
          >
            <div className="mb-4 flex items-center gap-3 border-b pb-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleItem(index)}
                id={`item-${index}`}
              />
              <h3 className="flex-1 text-lg font-bold text-primary">
                {item.itemName} ({item.itemQuantity})
              </h3>
              <span className="text-xs text-muted-foreground">
                {item.scanOffsetStart} - {item.scanOffsetEnd}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-full">
                <h4 className="mb-2 text-sm font-bold text-accent">Dimensions</h4>
                <p className="text-sm text-foreground">
                  H: {item.dimHeightCm}cm | L: {item.dimLengthCm}cm | W:{" "}
                  {item.dimWidthCm}cm
                </p>
              </div>

              <div className="col-span-full">
                <h4 className="mb-2 text-sm font-bold text-accent">Packaging</h4>
                {item.packagingPlan.map((layer, layerIndex) => (
                  <div
                    key={layerIndex}
                    className={cn(
                      "mb-2 rounded-md border p-4 shadow-sm",
                      layerIndex % 2 === 0 ? "bg-secondary/10" : "bg-secondary/5",
                    )}
                  >
                    <h4 className="mb-1 text-sm font-semibold">Layer {layer.layerOrder}</h4>
                    <p className="text-sm font-medium text-foreground">
                      {layer.materialName}: {layer.quantity}{" "}
                      {layer.unitId}
                    </p>
                    {(layer.packedVolumeM3 !== undefined && layer.packedVolumeM3 !== null) && (
                      <p className="text-sm text-muted-foreground">
                        Volume: {formatVolume(layer.packedVolumeM3)} {volumeLabel}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="col-span-full">
                <h4 className="mb-2 text-sm font-bold text-accent">Attributes</h4>
                <div className="flex flex-wrap gap-2">
                  {item.attributes.map((attribute, attrIndex) => (
                    <span
                      key={attrIndex}
                      className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                    >
                      {attribute.key}: {attribute.value}
                    </span>
                  ))}
                </div>
              </div>

              {item.notesRaw && (
                <div className="col-span-full">
                  <h4 className="mb-2 text-sm font-bold text-accent">Notes</h4>
                  <div className="rounded-md border-l-4 border-accent bg-secondary/30 p-3 text-sm text-foreground">
                    {item.notesRaw}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export const DigitalManifestModal: FC<DigitalManifestModalProps> = ({
  manifestData,
  isLoading,
  isOpen,
  onClose,
  uploadId,
  getVideoLink,
}) => {
  const isMobile = useIsMobile();
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("m3");
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Select all when manifest data changes
  const itemCount = manifestData?.length ?? 0;

  // Reset selection when data changes
  useMemo(() => {
    if (manifestData && manifestData.length > 0) {
      setSelectedIndices(new Set(manifestData.map((_, i) => i)));
    } else {
      setSelectedIndices(new Set());
    }
  }, [manifestData]);

  const allSelected = itemCount > 0 && selectedIndices.size === itemCount;

  const toggleItem = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(Array.from({ length: itemCount }, (_, i) => i)));
    }
  };

  const selectedItems = useMemo(() => {
    if (!manifestData) return [];
    return manifestData.filter((_, i) => selectedIndices.has(i));
  }, [manifestData, selectedIndices]);

  const totalVolumeM3 = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const { dimHeightCm, dimLengthCm, dimWidthCm } = item;
      const itemVolumeM3 = (dimHeightCm * dimLengthCm * dimWidthCm) / 1_000_000;

      const packingMaterialVolumeM3 = item.packagingPlan.reduce((layerTotal, layer) => {
        return layerTotal + (layer.packedVolumeM3 || 0);
      }, 0);

      return total + itemVolumeM3 + packingMaterialVolumeM3;
    }, 0);
  }, [selectedItems]);

  const aggregatedMaterials = useMemo((): AggregatedMaterial[] => {
    const materialMap = new Map<string, AggregatedMaterial>();

    selectedItems.forEach((item) => {
      item.packagingPlan.forEach((layer) => {
        const key = `${layer.materialName}__${layer.unitId}`;
        const existing = materialMap.get(key);
        if (existing) {
          existing.totalQuantity += layer.quantity;
        } else {
          materialMap.set(key, {
            materialName: layer.materialName,
            totalQuantity: layer.quantity,
            unitId: layer.unitId,
          });
        }
      });
    });

    return Array.from(materialMap.values()).sort((a, b) =>
      a.materialName.localeCompare(b.materialName)
    );
  }, [selectedItems]);

  const formatVolume = useCallback((volumeM3: number): string => {
    if (volumeUnit === "ft3") {
      return (volumeM3 * M3_TO_FT3).toFixed(2);
    }
    return volumeM3.toFixed(2);
  }, [volumeUnit]);

  const volumeLabel = volumeUnit === "m3" ? "m³" : "ft³";

  // Summary Bar Component
  const SummaryBar = () => (
    <div className="border-t bg-muted/30 px-6 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium text-muted-foreground">Total Volume: </span>
          <span className="font-bold text-primary">{formatVolume(totalVolumeM3)} {volumeLabel}</span>
          {selectedIndices.size < itemCount && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({selectedIndices.size}/{itemCount} items)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-md border bg-background p-1">
          <Button
            variant={volumeUnit === "m3" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setVolumeUnit("m3")}
          >
            m³
          </Button>
          <Button
            variant={volumeUnit === "ft3" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setVolumeUnit("ft3")}
          >
            ft³
          </Button>
        </div>
      </div>

      {/* Packing Materials Summary */}
      {aggregatedMaterials.length > 0 && (
        <div className="rounded-lg border bg-background p-3">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-bold text-foreground">Total Packing Materials</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {aggregatedMaterials.map((mat) => (
              <span
                key={`${mat.materialName}__${mat.unitId}`}
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {mat.materialName}: {mat.totalQuantity} {mat.unitId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // State for mobile collapsible video
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Mobile: Use Sheet with collapsible video
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="flex w-full h-full flex-col p-0 sm:max-w-md overflow-hidden" hideCloseButton={true}>
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/80 text-primary">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              <p className="mt-4 text-lg font-bold">Loading manifest...</p>
            </div>
          )}

          <SheetHeader className="relative flex flex-row items-center justify-between border-b bg-primary px-6 py-5 text-white">
            <SheetTitle className="text-xl font-bold text-white">Digital Manifest</SheetTitle>
            <SheetClose asChild>
              <button
                onClick={onClose}
                className="absolute right-4 top-1/3 -translate-y-1/2 rounded-sm opacity-70 text-white ring-offset-background transition-opacity hover:bg-primary/80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Video Preview for Mobile - collapsible, inside scroll area */}
            {uploadId && (
              <div className="border-b">
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setIsVideoOpen((prev) => !prev)}
                >
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Video Preview</span>
                  </div>
                  {isVideoOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <div className={cn("px-4 pb-4", !isVideoOpen && "hidden")}>
                  <VideoPreview uploadId={uploadId} getVideoLink={getVideoLink} />
                </div>
              </div>
            )}

            <div className="p-6">
              <ManifestContent
                manifestData={manifestData}
                selectedIndices={selectedIndices}
                toggleItem={toggleItem}
                toggleAll={toggleAll}
                allSelected={allSelected}
                itemCount={itemCount}
                formatVolume={formatVolume}
                volumeLabel={volumeLabel}
              />
            </div>
          </div>

          {manifestData && manifestData.length > 0 && (
            <div className="flex-shrink-0 border-t">
              <button
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setIsSummaryOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    Total: {formatVolume(totalVolumeM3)} {volumeLabel}
                  </span>
                  {selectedIndices.size < itemCount && (
                    <span className="text-xs text-muted-foreground">
                      ({selectedIndices.size}/{itemCount})
                    </span>
                  )}
                </div>
                {isSummaryOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <div className={cn(!isSummaryOpen && "hidden")}>
                <SummaryBar />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Fullscreen dialog with video on the left
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[100dvh] w-[100dvw] max-w-none max-h-none flex-col gap-0 p-0 overflow-hidden rounded-none border-0">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 text-primary">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="mt-4 text-lg font-bold">Loading manifest...</p>
          </div>
        )}

        <DialogHeader className="border-b bg-primary px-6 py-5">
          <DialogTitle className="text-xl font-bold text-white">Digital Manifest</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left side - Video Preview */}
          {uploadId && (
            <div className="w-[350px] flex-shrink-0 flex flex-col border-r bg-muted/20 p-4 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <Play className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-bold text-foreground">Video Preview</h4>
              </div>
              <div className="sticky top-0">
                <VideoPreview uploadId={uploadId} getVideoLink={getVideoLink} />
              </div>
            </div>
          )}

          {/* Right side - Manifest Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              <ManifestContent
                manifestData={manifestData}
                selectedIndices={selectedIndices}
                toggleItem={toggleItem}
                toggleAll={toggleAll}
                allSelected={allSelected}
                itemCount={itemCount}
                formatVolume={formatVolume}
                volumeLabel={volumeLabel}
              />
            </div>
            {manifestData && manifestData.length > 0 && <SummaryBar />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
