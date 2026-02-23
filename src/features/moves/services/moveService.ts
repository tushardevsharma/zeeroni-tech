import { useMemo } from "react";
import { useAuth } from "@/features/partner/auth/AuthContext";
import { createMoveService } from "./moveApi";

/**
 * Hook that provides the MoveMgmt API client with auth.
 * Use this in all moves components instead of a static moveService.
 */
export function useMoveService() {
  const { getToken } = useAuth();
  return useMemo(() => createMoveService(getToken ?? (() => null)), [getToken]);
}

export { createMoveService } from "./moveApi";
export type { MoveService } from "./moveApi";
