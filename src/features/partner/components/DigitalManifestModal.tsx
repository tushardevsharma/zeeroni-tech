import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GeminiAnalyzedItem,
  GeminiLogistics,
  GeminiPackagingLayer,
} from "../types";

type VolumeUnit = "m3" | "ft3";
const M3_TO_FT3 = 35.3147;

interface DigitalManifestModalProps {
  manifestData: GeminiAnalyzedItem[] | null;
  isLoading: boolean;
  isOpen: boolean; // Control visibility with this prop
  onClose: () => void;
}

export const DigitalManifestModal: FC<DigitalManifestModalProps> = ({
  manifestData,
  isLoading,
  isOpen,
  onClose,
}) => {
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("m3");

  const getLogisticsTags = useCallback((logistics: GeminiLogistics): string[] => {
    const tags: string[] = [];
    tags.push(`Fragility: ${logistics.fragility}`);
    tags.push(`Stackable: ${logistics.is_stackable ? "Yes" : "No"}`);
    tags.push(`Disassembly: ${logistics.requires_disassembly ? "Yes" : "No"}`);
    tags.push(`Priority: ${logistics.handling_priority}`);
    return tags;
  }, []);

  const sortPackagingPlan = useCallback(
    (packagingPlan: GeminiPackagingLayer[]): GeminiPackagingLayer[] => {
      return [...packagingPlan].sort((a, b) => a.layer_order - b.layer_order);
    },
    [],
  );

  const totalVolumeM3 = useMemo(() => {
  if (!manifestData) return 0;

  return manifestData.reduce((total, item) => {
    // 1. Calculate Item Volume: (H * L * W) / 1,000,000 to get m3
    const { height_cm, length_cm, width_cm } = item.dimensions;
    const itemVolumeM3 = (height_cm * length_cm * width_cm) / 1_000_000;

    // 2. Calculate Packaging Material Volume from the plan
    const packingMaterialVolumeM3 = item.packaging_plan.reduce((layerTotal, layer) => {
      return layerTotal + (layer.packed_volume_m3 || 0);
    }, 0);

    // 3. Sum both and add to the accumulator
    return total + itemVolumeM3 + packingMaterialVolumeM3;
  }, 0);
}, [manifestData]);

  const formatVolume = useCallback((volumeM3: number): string => {
    if (volumeUnit === "ft3") {
      return (volumeM3 * M3_TO_FT3).toFixed(2);
    }
    return volumeM3.toFixed(2);
  }, [volumeUnit]);

  const volumeLabel = volumeUnit === "m3" ? "m³" : "ft³";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md" hideCloseButton={true}> {/* Hide default close button */}
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

        {/* Total Volume & Unit Toggle */}
        {manifestData && manifestData.length > 0 && (
          <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-3">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Total Volume: </span>
              <span className="font-bold text-primary">{formatVolume(totalVolumeM3)} {volumeLabel}</span>
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
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {!manifestData || manifestData.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No digital manifest data available.
            </div>
          ) : (
            manifestData.map((item, index) => (
              <div key={index} className="mb-5 rounded-lg border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-bold text-primary">
                    {item.item} ({item.quantity})
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {item.timestamp_start} - {item.timestamp_end}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-full">
                    <h4 className="mb-2 text-sm font-bold text-accent">Dimensions</h4>
                    <p className="text-sm text-foreground">
                      H: {item.dimensions.height_cm}cm | L: {item.dimensions.length_cm}cm | W:{" "}
                      {item.dimensions.width_cm}cm
                    </p>
                  </div>

                  <div className="col-span-full">
                    <h4 className="mb-2 text-sm font-bold text-accent">Packaging</h4>
                    {sortPackagingPlan(item.packaging_plan).map((layer, layerIndex) => (
                      <div
                        key={layerIndex}
                        className={cn(
                          "mb-2 rounded-md border p-4 shadow-sm",
                          layerIndex % 2 === 0 ? "bg-secondary/10" : "bg-secondary/5",
                        )}
                      >
                        <h4 className="mb-1 text-sm font-semibold">{layer.layer_order}</h4>
                        <p className="text-sm font-medium text-foreground">
                          {layer.primary_material_type}: {layer.quantity_estimate}{" "}
                          {layer.unit}
                        </p>
                        {layer.packed_volume_m3 && (
                          <p className="text-sm text-muted-foreground">
                            Volume: {formatVolume(layer.packed_volume_m3)} {volumeLabel}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="col-span-full">
                    <h4 className="mb-2 text-sm font-bold text-accent">Logistics</h4>
                    <div className="flex flex-wrap gap-2">
                      {getLogisticsTags(item.logistics).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.notes && (
                    <div className="col-span-full">
                      <h4 className="mb-2 text-sm font-bold text-accent">Notes</h4>
                      <div className="rounded-md border-l-4 border-accent bg-secondary/30 p-3 text-sm text-foreground">
                        {item.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
