import { useState, useEffect, useRef } from "react";

const PROCESSING_MESSAGES = [
  "Looking for your furniture…",
  "Found a few things! Measuring them now…",
  "Estimating how many boxes you'll need…",
  "Double-checking the fragile items…",
  "Cataloguing everything room by room…",
  "Calculating volumetric weights…",
  "Preparing your zero-touch inventory…",
];

const CYCLE_INTERVAL_MS = 4000;

/**
 * Returns a cycling status message for a given upload ID while it's in a processing state.
 * Each upload gets its own independent cycle so messages don't jump when the list re-renders.
 */
export function useProcessingMessages(activeUploadIds: string[]) {
  const [messageIndexes, setMessageIndexes] = useState<Record<string, number>>({});
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize new uploads at index 0
    setMessageIndexes((prev) => {
      const next = { ...prev };
      for (const id of activeUploadIds) {
        if (!(id in next)) {
          next[id] = 0;
        }
      }
      // Clean up uploads that are no longer active
      for (const id of Object.keys(next)) {
        if (!activeUploadIds.includes(id)) {
          delete next[id];
        }
      }
      return next;
    });

    if (activeUploadIds.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setMessageIndexes((prev) => {
        const next = { ...prev };
        for (const id of activeUploadIds) {
          if (id in next) {
            next[id] = (next[id] + 1) % PROCESSING_MESSAGES.length;
          }
        }
        return next;
      });
    }, CYCLE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeUploadIds.join(",")]); // stable dependency

  const getMessage = (uploadId: string): string => {
    const index = messageIndexes[uploadId] ?? 0;
    return PROCESSING_MESSAGES[index];
  };

  return { getMessage };
}
