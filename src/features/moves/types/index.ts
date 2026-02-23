export type MoveStatus =
  | "lead_converted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Move {
  id: string;
  leadId: string;
  leadName: string;
  status: MoveStatus;
  moveDate: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export type HouseType = "Source" | "Destination" | "Storage";

export interface MoveHouse {
  id: string;
  moveId: string;
  address: string;
  type: HouseType;
  floor: number;
  hasLift: boolean;
  notes?: string;
}

export interface MoveRoom {
  id: string;
  houseId: string;
  name: string;
  notes?: string;
  isActive: boolean;
  videoAnalysisStatus?: "none" | "uploading" | "processing" | "completed" | "failed";
  detectedItemsCount?: number;
}

export interface MoveLogistics {
  id: string;
  moveId: string;
  distanceKm: number;
  truckSizeType: string;
  crewCountEst: number;
  complexityScore: number;
  quotedAmount: number;
  specialNotes?: string;
}

export interface ItemStatus {
  id: string;
  roomId: string;
  inventoryItemId: string;
  itemName: string;
  isPacked: boolean;
  packedAt?: string;
  isHighValue: boolean;
  isFragile: boolean;
  packedByUserId?: string;
}

export interface ItemQualityControl {
  id: string;
  inventoryItemId: string;
  aiPackagingSuggestion?: string;
  aiQualityScore?: number;
  captainVerdict?: string;
  captainNotes?: string;
  lastVerifiedAt?: string;
}

export interface ItemPhoto {
  id: string;
  inventoryItemId: string;
  photoUrl: string;
  photoType: "before" | "after" | "damage";
  capturedBy: string;
  createdAt: string;
}

export interface CreateMoveRequest {
  leadId: string;
  customerName?: string;
  status?: MoveStatus;
  moveDate: string;
  logistics?: {
    quotedAmount?: number;
  };
}

export interface CreateMoveHouseRequest {
  moveId: string;
  address: string;
  type: HouseType;
  floor: number;
  hasLift: boolean;
  notes?: string;
}

export interface CreateMoveRoomRequest {
  houseId: string;
  name: string;
  notes?: string;
}
