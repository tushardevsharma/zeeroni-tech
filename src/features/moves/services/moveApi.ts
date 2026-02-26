/**
 * MoveMgmt API client. Uses VITE_MOVE_API_URL (Move microservice).
 * Option A for ItemPhoto: map API CapturedAt -> createdAt in responses.
 */

import type {
  Move,
  MoveHouse,
  MoveRoom,
  MoveLogistics,
  ItemStatus,
  ItemQualityControl,
  ItemPhoto,
  MoveStatus,
  CreateMoveRequest,
  CreateMoveHouseRequest,
  CreateMoveRoomRequest,
  HouseType,
} from "../types";

const MOVE_STATUS_TO_API: Record<MoveStatus, string> = {
  lead_converted: "LeadConverted",
  scheduled: "Scheduled",
  in_progress: "InProgress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const API_STATUS_TO_UI: Record<string, MoveStatus> = {
  LeadConverted: "lead_converted",
  Scheduled: "scheduled",
  InProgress: "in_progress",
  Completed: "completed",
  Cancelled: "cancelled",
};

function toApiStatus(s: MoveStatus): string {
  return MOVE_STATUS_TO_API[s] ?? s;
}

function toUiStatus(s: string): MoveStatus {
  return API_STATUS_TO_UI[s] ?? "lead_converted";
}

/** Map API photo response: CapturedAt -> createdAt (Option A, no backend change) */
function mapPhoto(api: { id: string; inventoryItemId: string; photoUrl: string; photoType?: string; capturedBy?: string; capturedAt?: string }): ItemPhoto {
  return {
    id: api.id,
    inventoryItemId: api.inventoryItemId,
    photoUrl: api.photoUrl,
    photoType: (api.photoType as ItemPhoto["photoType"]) ?? "before",
    capturedBy: api.capturedBy ?? "",
    createdAt: api.capturedAt ?? new Date().toISOString(),
  };
}

/** Map API item status (no id/itemName) to UI shape; use inventoryItemId as id */
function mapItemStatus(api: {
  inventoryItemId: string;
  currentRoomId?: string | null;
  isPacked?: boolean;
  packedAt?: string | null;
  isHighValue?: boolean;
  isFragile?: boolean;
  packedByUserId?: string | null;
}, roomId?: string): ItemStatus {
  return {
    id: api.inventoryItemId,
    roomId: api.currentRoomId ?? roomId ?? "",
    inventoryItemId: api.inventoryItemId,
    itemName: "", // API has no ItemName; display can use inventoryItemId
    isPacked: api.isPacked ?? false,
    packedAt: api.packedAt ?? undefined,
    isHighValue: api.isHighValue ?? false,
    isFragile: api.isFragile ?? false,
    packedByUserId: api.packedByUserId ?? undefined,
  };
}

export function createMoveService(getToken: () => string | null) {
  const base = (import.meta.env.VITE_MOVE_API_URL ?? "").replace(/\/$/, "");

  function headers(): HeadersInit {
    const h: HeadersInit = { "Content-Type": "application/json" };
    const t = getToken();
    if (t) (h as Record<string, string>)["Authorization"] = `Bearer ${t}`;
    return h;
  }

  async function checkResp(res: Response): Promise<void> {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
  }

  return {
    async getMoves(): Promise<Move[]> {
      const res = await fetch(`${base}/moves`, { headers: headers() });
      await checkResp(res);
      const list = await res.json();
      return (Array.isArray(list) ? list : []).map((m: Record<string, unknown>) => ({
        id: String(m.id ?? ""),
        leadId: String(m.leadId ?? ""),
        leadName: String(m.customerName ?? m.leadName ?? ""),
        status: toUiStatus(String(m.status ?? "LeadConverted")),
        moveDate: String(m.moveDate ?? ""),
        createdAt: String(m.createdAt ?? ""),
        updatedAt: String(m.updatedAt ?? ""),
        isActive: m.isActive !== false,
      }));
    },

    async getMove(id: string): Promise<Move | undefined> {
      const res = await fetch(`${base}/moves/${id}`, { headers: headers() });
      if (res.status === 404) return undefined;
      await checkResp(res);
      const m = await res.json();
      return {
        id: m.id,
        leadId: m.leadId,
        leadName: m.customerName ?? m.leadName ?? "",
        status: toUiStatus(String(m.status ?? "LeadConverted")),
        moveDate: m.moveDate ?? "",
        createdAt: m.createdAt ?? "",
        updatedAt: m.updatedAt ?? "",
        isActive: m.isActive !== false,
      };
    },

    async createMove(req: CreateMoveRequest & { leadName?: string }): Promise<Move> {
      const customerName = req.leadName ?? req.customerName ?? null;
      const status = req.status != null ? toApiStatus(req.status) : "LeadConverted";
      const body: Record<string, unknown> = {
        leadId: req.leadId,
        customerName,
        status,
        moveDate: req.moveDate ?? null,
      };
      if (req.logistics?.quotedAmount != null) {
        body.logistics = { quotedAmount: req.logistics.quotedAmount };
      }
      const res = await fetch(`${base}/moves`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body),
      });
      await checkResp(res);
      const m = await res.json();
      return {
        id: m.id,
        leadId: m.leadId,
        leadName: m.customerName ?? m.leadName ?? "",
        status: toUiStatus(String(m.status ?? "LeadConverted")),
        moveDate: m.moveDate ?? "",
        createdAt: m.createdAt ?? "",
        updatedAt: m.updatedAt ?? "",
        isActive: m.isActive !== false,
      };
    },

    async updateMoveStatus(id: string, status: MoveStatus): Promise<Move | undefined> {
      const res = await fetch(`${base}/moves/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ status: toApiStatus(status) }),
      });
      if (res.status === 404) return undefined;
      await checkResp(res);
      const m = await res.json();
      return {
        id: m.id,
        leadId: m.leadId,
        leadName: m.customerName ?? m.leadName ?? "",
        status: toUiStatus(String(m.status)),
        moveDate: m.moveDate ?? "",
        createdAt: m.createdAt ?? "",
        updatedAt: m.updatedAt ?? "",
        isActive: m.isActive !== false,
      };
    },

    async deleteMove(id: string): Promise<void> {
      const res = await fetch(`${base}/moves/${id}`, { method: "DELETE", headers: headers() });
      if (res.status !== 204 && res.status !== 404) await checkResp(res);
    },

    async getHouses(moveId: string): Promise<MoveHouse[]> {
      const res = await fetch(`${base}/moves/${moveId}/movehouses`, { headers: headers() });
      await checkResp(res);
      const list = await res.json();
      return (Array.isArray(list) ? list : []).map((h: Record<string, unknown>) => ({
        id: String(h.id ?? ""),
        moveId: String(h.moveId ?? ""),
        address: String(h.address ?? ""),
        type: (typeof h.houseType === "string" ? h.houseType : ["Source", "Destination", "Storage"][Number(h.houseType)] ?? "Source") as HouseType,
        floor: Number(h.floor) ?? 0,
        hasLift: h.hasLift === true,
        notes: h.notes as string | undefined,
      }));
    },

    async createHouse(req: CreateMoveHouseRequest): Promise<MoveHouse> {
      const res = await fetch(`${base}/movehouses`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          moveId: req.moveId,
          houseType: req.type,
          address: req.address,
          floor: req.floor ?? 0,
          hasLift: req.hasLift ?? true,
        }),
      });
      await checkResp(res);
      const h = await res.json();
      return {
        id: h.id,
        moveId: h.moveId,
        address: h.address ?? "",
        type: (typeof h.houseType === "string" ? h.houseType : "Source") as HouseType,
        floor: Number(h.floor) ?? 0,
        hasLift: h.hasLift === true,
        notes: h.notes,
      };
    },

    async deleteHouse(id: string): Promise<void> {
      const res = await fetch(`${base}/movehouses/${id}`, { method: "DELETE", headers: headers() });
      if (res.status !== 204 && res.status !== 404) await checkResp(res);
    },

    async getRooms(houseId: string): Promise<MoveRoom[]> {
      const res = await fetch(`${base}/movehouses/${houseId}/moverooms`, { headers: headers() });
      await checkResp(res);
      const list = await res.json();
      return (Array.isArray(list) ? list : []).map((r: Record<string, unknown>) => ({
        id: String(r.id ?? ""),
        houseId: String(r.houseId ?? ""),
        name: String(r.roomName ?? r.name ?? ""),
        notes: r.notes as string | undefined,
        isActive: r.isActive !== false,
        videoAnalysisStatus: r.videoAnalysisStatus as MoveRoom["videoAnalysisStatus"],
        detectedItemsCount: r.detectedItemsCount as number | undefined,
      }));
    },

    async createRoom(req: CreateMoveRoomRequest): Promise<MoveRoom> {
      const res = await fetch(`${base}/moverooms`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          houseId: req.houseId,
          roomName: req.name,
          notes: req.notes ?? null,
          isActive: true,
        }),
      });
      await checkResp(res);
      const r = await res.json();
      return {
        id: r.id,
        houseId: r.houseId,
        name: r.roomName ?? r.name ?? "",
        notes: r.notes,
        isActive: r.isActive !== false,
        videoAnalysisStatus: r.videoAnalysisStatus,
        detectedItemsCount: r.detectedItemsCount,
      };
    },

    async deleteRoom(id: string): Promise<void> {
      const res = await fetch(`${base}/moverooms/${id}`, { method: "DELETE", headers: headers() });
      if (res.status !== 204 && res.status !== 404) await checkResp(res);
    },

    async getItems(roomId: string): Promise<ItemStatus[]> {
      const res = await fetch(`${base}/moverooms/${roomId}/itemstatuses`, { headers: headers() });
      await checkResp(res);
      const list = await res.json();
      return (Array.isArray(list) ? list : []).map((i: Record<string, unknown>) =>
        mapItemStatus(
          {
            inventoryItemId: String(i.inventoryItemId ?? ""),
            currentRoomId: i.currentRoomId as string | undefined,
            isPacked: i.isPacked as boolean | undefined,
            packedAt: i.packedAt as string | undefined,
            isHighValue: i.isHighValue as boolean | undefined,
            isFragile: i.isFragile as boolean | undefined,
            packedByUserId: i.packedByUserId as string | undefined,
          },
          roomId,
        ),
      );
    },

    /** getItem(id): id is inventoryItemId (API key) */
    async getItem(inventoryItemId: string): Promise<ItemStatus | undefined> {
      const res = await fetch(`${base}/itemstatuses/${inventoryItemId}`, { headers: headers() });
      if (res.status === 404) return undefined;
      await checkResp(res);
      const i = await res.json();
      return mapItemStatus({
        inventoryItemId: i.inventoryItemId,
        currentRoomId: i.currentRoomId,
        isPacked: i.isPacked,
        packedAt: i.packedAt,
        isHighValue: i.isHighValue,
        isFragile: i.isFragile,
        packedByUserId: i.packedByUserId,
      });
    },

    async updateItem(inventoryItemId: string, updates: Partial<ItemStatus>): Promise<ItemStatus | undefined> {
      const res = await fetch(`${base}/itemstatuses/${inventoryItemId}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({
          currentRoomId: updates.roomId ?? undefined,
          isPacked: updates.isPacked,
          packedAt: updates.packedAt,
          isHighValue: updates.isHighValue,
          isFragile: updates.isFragile,
          packedByUserId: updates.packedByUserId,
        }),
      });
      if (res.status === 404) return undefined;
      await checkResp(res);
      const i = await res.json();
      return mapItemStatus(i);
    },

    async deleteItem(inventoryItemId: string): Promise<void> {
      const res = await fetch(`${base}/itemstatuses/${inventoryItemId}`, { method: "DELETE", headers: headers() });
      if (res.status !== 204 && res.status !== 404) await checkResp(res);
    },

    async createItemStatusesBulk(
      itemStatuses: Array<{
        inventoryItemId: string;
        currentRoomId: string | null;
        isPacked?: boolean;
        packedAt?: string | null;
        isHighValue?: boolean;
        isFragile?: boolean;
        packedByUserId?: string;
      }>,
    ): Promise<void> {
      const res = await fetch(`${base}/itemstatuses/bulk`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          itemStatuses: itemStatuses.map((i) => ({
            inventoryItemId: i.inventoryItemId,
            currentRoomId: i.currentRoomId,
            isPacked: i.isPacked ?? false,
            packedAt: i.packedAt ?? null,
            isHighValue: i.isHighValue ?? false,
            isFragile: i.isFragile ?? false,
            packedByUserId: i.packedByUserId ?? "",
          })),
        }),
      });
      await checkResp(res);
    },

    async getLogistics(moveId: string): Promise<MoveLogistics | undefined> {
      const res = await fetch(`${base}/moves/${moveId}/movelogistics`, { headers: headers() });
      if (res.status === 404) return undefined;
      await checkResp(res);
      const l = await res.json();
      return {
        id: l.moveId ?? l.id,
        moveId: l.moveId,
        distanceKm: Number(l.distanceKm) ?? 0,
        truckSizeType: l.truckSizeType ?? "",
        crewCountEst: Number(l.crewCountEst) ?? 0,
        complexityScore: Number(l.complexityScore) ?? 0,
        quotedAmount: Number(l.quotedAmount) ?? 0,
        specialNotes: l.specialNotes,
      };
    },

    async getQC(inventoryItemId: string): Promise<ItemQualityControl | undefined> {
      const res = await fetch(`${base}/itemqualitycontrols/${inventoryItemId}`, { headers: headers() });
      if (res.status === 404) return undefined;
      await checkResp(res);
      const q = await res.json();
      return {
        id: q.inventoryItemId ?? q.id,
        inventoryItemId: q.inventoryItemId,
        aiPackagingSuggestion: q.aiPackagingSuggestion,
        aiQualityScore: q.aiQualityScore,
        captainVerdict: q.captainVerdict,
        captainNotes: q.captainNotes,
        lastVerifiedAt: q.lastVerifiedAt,
      };
    },

    async getPhotos(inventoryItemId: string): Promise<ItemPhoto[]> {
      const res = await fetch(`${base}/itemstatuses/${inventoryItemId}/itemphotos`, { headers: headers() });
      await checkResp(res);
      const list = await res.json();
      return (Array.isArray(list) ? list : []).map((p: Record<string, unknown>) =>
        mapPhoto({
          id: String(p.id ?? ""),
          inventoryItemId: String(p.inventoryItemId ?? inventoryItemId),
          photoUrl: String(p.photoUrl ?? ""),
          photoType: p.photoType as string | undefined,
          capturedBy: p.capturedBy as string | undefined,
          capturedAt: (p.capturedAt ?? p.createdAt) as string | undefined,
        }),
      );
    },

    async addPhoto(data: Omit<ItemPhoto, "id" | "createdAt">): Promise<ItemPhoto> {
      const res = await fetch(`${base}/itemphotos`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          inventoryItemId: data.inventoryItemId,
          photoUrl: data.photoUrl,
          photoType: data.photoType,
          capturedBy: data.capturedBy,
        }),
      });
      await checkResp(res);
      const p = await res.json();
      return mapPhoto({
        id: p.id,
        inventoryItemId: p.inventoryItemId,
        photoUrl: p.photoUrl,
        photoType: p.photoType,
        capturedBy: p.capturedBy,
        capturedAt: p.capturedAt ?? p.createdAt,
      });
    },

    async deletePhoto(id: string): Promise<void> {
      const res = await fetch(`${base}/itemphotos/${id}`, { method: "DELETE", headers: headers() });
      if (res.status !== 204 && res.status !== 404) await checkResp(res);
    },
  };
}

export type MoveService = ReturnType<typeof createMoveService>;
