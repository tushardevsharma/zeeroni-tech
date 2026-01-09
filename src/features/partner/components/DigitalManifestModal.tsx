import React, { FC, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Assuming Sheet is used for slide-over modal
import { cn } from "@/lib/utils"; // Utility for combining Tailwind classes
import { X } from "lucide-react"; // Close icon
import {
  GeminiAnalyzedItem,
  GeminiLogistics,
  GeminiPackagingLayer,
} from "../../types"; // Adjust path as needed

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/80 text-primary">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="mt-4 text-lg font-bold">Loading manifest...</p>
          </div>
        )}

        <SheetHeader className="flex flex-row items-center justify-between border-b bg-primary px-6 py-5 text-white">
          <SheetTitle className="text-xl font-bold text-white">Digital Manifest</SheetTitle>
          <button
            className="text-2xl font-bold text-white transition-opacity hover:opacity-70"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </SheetHeader>

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
                          layerIndex % 2 === 0 ? "bg-secondary/10" : "bg-secondary/5", // Applying alternating background
                        )}
                      >
                        <h4 className="mb-1 text-sm font-semibold">{layer.layer_order}</h4>
                        <p className="text-sm font-medium text-foreground">
                          {layer.primary_material_type}: {layer.quantity_estimate}{" "}
                          {layer.unit}
                        </p>
                        {layer.packed_volume_m3 && (
                          <p className="text-sm text-muted-foreground">
                            Volume: {layer.packed_volume_m3} m³
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
