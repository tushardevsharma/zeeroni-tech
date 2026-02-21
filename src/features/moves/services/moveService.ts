import {
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

// --- Dummy Data Store ---
let moves: Move[] = [
  {
    id: "MOV-001",
    leadId: "LEAD-101",
    leadName: "Sarah Johnson",
    status: "scheduled",
    moveDate: "2026-03-15",
    createdAt: "2026-02-18T10:00:00Z",
    updatedAt: "2026-02-18T10:00:00Z",
    isActive: true,
  },
  {
    id: "MOV-002",
    leadId: "LEAD-102",
    leadName: "Marcus Chen",
    status: "in_progress",
    moveDate: "2026-02-25",
    createdAt: "2026-02-10T08:30:00Z",
    updatedAt: "2026-02-20T14:00:00Z",
    isActive: true,
  },
];

let houses: MoveHouse[] = [
  { id: "HSE-001", moveId: "MOV-001", address: "123 Oak Street, Apt 4B, Melbourne VIC 3000", type: "Source", floor: 4, hasLift: true },
  { id: "HSE-002", moveId: "MOV-001", address: "456 Elm Avenue, Sydney NSW 2000", type: "Destination", floor: 1, hasLift: false },
  { id: "HSE-003", moveId: "MOV-002", address: "789 Pine Road, Brisbane QLD 4000", type: "Source", floor: 2, hasLift: true },
];

let rooms: MoveRoom[] = [
  { id: "RM-001", houseId: "HSE-001", name: "Living Room", notes: "Large open area", isActive: true, videoAnalysisStatus: "completed", detectedItemsCount: 8 },
  { id: "RM-002", houseId: "HSE-001", name: "Master Bedroom", isActive: true, videoAnalysisStatus: "none" },
  { id: "RM-003", houseId: "HSE-001", name: "Kitchen", isActive: true, videoAnalysisStatus: "processing" },
  { id: "RM-004", houseId: "HSE-003", name: "Office", notes: "Lots of electronics", isActive: true, videoAnalysisStatus: "completed", detectedItemsCount: 12 },
];

let items: ItemStatus[] = [
  { id: "ITM-001", roomId: "RM-001", inventoryItemId: "INV-001", itemName: "3-Seater Sofa", isPacked: false, isHighValue: false, isFragile: false },
  { id: "ITM-002", roomId: "RM-001", inventoryItemId: "INV-002", itemName: "55\" Samsung TV", isPacked: true, packedAt: "2026-02-20T09:00:00Z", isHighValue: true, isFragile: true },
  { id: "ITM-003", roomId: "RM-001", inventoryItemId: "INV-003", itemName: "Coffee Table (Glass)", isPacked: false, isHighValue: false, isFragile: true },
  { id: "ITM-004", roomId: "RM-004", inventoryItemId: "INV-004", itemName: "Standing Desk", isPacked: false, isHighValue: true, isFragile: false },
  { id: "ITM-005", roomId: "RM-004", inventoryItemId: "INV-005", itemName: "Gaming Monitor", isPacked: false, isHighValue: true, isFragile: true },
];

let logistics: MoveLogistics[] = [
  { id: "LOG-001", moveId: "MOV-001", distanceKm: 878, truckSizeType: "Large (40ft)", crewCountEst: 4, complexityScore: 7.5, quotedAmount: 4500, specialNotes: "Piano requires special handling" },
  { id: "LOG-002", moveId: "MOV-002", distanceKm: 15, truckSizeType: "Medium (20ft)", crewCountEst: 3, complexityScore: 5.0, quotedAmount: 1800 },
];

let qcRecords: ItemQualityControl[] = [
  { id: "QC-001", inventoryItemId: "INV-002", aiPackagingSuggestion: "Double-box with foam inserts", aiQualityScore: 92, captainVerdict: "Approved", captainNotes: "Packed with extra bubble wrap", lastVerifiedAt: "2026-02-20T09:30:00Z" },
];

let photos: ItemPhoto[] = [
  { id: "PH-001", inventoryItemId: "INV-002", photoUrl: "https://placehold.co/400x300/1a4a3a/white?text=TV+Before", photoType: "before", capturedBy: "Captain Mike", createdAt: "2026-02-20T08:45:00Z" },
];

// --- Helpers ---
let idCounter = 100;
const genId = (prefix: string) => `${prefix}-${++idCounter}`;
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// --- Move CRUD ---
export const moveService = {
  // Moves
  async getMoves(): Promise<Move[]> {
    await delay();
    return [...moves];
  },
  async getMove(id: string): Promise<Move | undefined> {
    await delay();
    return moves.find((m) => m.id === id);
  },
  async createMove(req: CreateMoveRequest & { leadName?: string }): Promise<Move> {
    await delay();
    const m: Move = {
      id: genId("MOV"),
      leadId: req.leadId,
      leadName: req.leadName || "Unknown",
      status: "lead_converted",
      moveDate: req.moveDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };
    moves.push(m);
    return m;
  },
  async updateMoveStatus(id: string, status: MoveStatus): Promise<Move | undefined> {
    await delay();
    const m = moves.find((x) => x.id === id);
    if (m) { m.status = status; m.updatedAt = new Date().toISOString(); }
    return m;
  },
  async deleteMove(id: string): Promise<void> {
    await delay();
    moves = moves.filter((m) => m.id !== id);
  },

  // Houses
  async getHouses(moveId: string): Promise<MoveHouse[]> {
    await delay();
    return houses.filter((h) => h.moveId === moveId);
  },
  async createHouse(req: CreateMoveHouseRequest): Promise<MoveHouse> {
    await delay();
    const h: MoveHouse = { id: genId("HSE"), ...req };
    houses.push(h);
    return h;
  },
  async deleteHouse(id: string): Promise<void> {
    await delay();
    houses = houses.filter((h) => h.id !== id);
  },

  // Rooms
  async getRooms(houseId: string): Promise<MoveRoom[]> {
    await delay();
    return rooms.filter((r) => r.houseId === houseId);
  },
  async createRoom(req: CreateMoveRoomRequest): Promise<MoveRoom> {
    await delay();
    const r: MoveRoom = { id: genId("RM"), ...req, isActive: true, videoAnalysisStatus: "none" };
    rooms.push(r);
    return r;
  },
  async deleteRoom(id: string): Promise<void> {
    await delay();
    rooms = rooms.filter((r) => r.id !== id);
  },

  // Items
  async getItems(roomId: string): Promise<ItemStatus[]> {
    await delay();
    return items.filter((i) => i.roomId === roomId);
  },
  async getItem(id: string): Promise<ItemStatus | undefined> {
    await delay();
    return items.find((i) => i.id === id);
  },
  async updateItem(id: string, updates: Partial<ItemStatus>): Promise<ItemStatus | undefined> {
    await delay();
    const item = items.find((i) => i.id === id);
    if (item) Object.assign(item, updates);
    return item;
  },
  async deleteItem(id: string): Promise<void> {
    await delay();
    items = items.filter((i) => i.id !== id);
  },

  // Logistics
  async getLogistics(moveId: string): Promise<MoveLogistics | undefined> {
    await delay();
    return logistics.find((l) => l.moveId === moveId);
  },
  async createLogistics(data: Omit<MoveLogistics, "id">): Promise<MoveLogistics> {
    await delay();
    const l: MoveLogistics = { id: genId("LOG"), ...data };
    logistics.push(l);
    return l;
  },
  async updateLogistics(id: string, updates: Partial<MoveLogistics>): Promise<MoveLogistics | undefined> {
    await delay();
    const l = logistics.find((x) => x.id === id);
    if (l) Object.assign(l, updates);
    return l;
  },

  // QC
  async getQC(inventoryItemId: string): Promise<ItemQualityControl | undefined> {
    await delay();
    return qcRecords.find((q) => q.inventoryItemId === inventoryItemId);
  },
  async upsertQC(data: Omit<ItemQualityControl, "id">): Promise<ItemQualityControl> {
    await delay();
    let existing = qcRecords.find((q) => q.inventoryItemId === data.inventoryItemId);
    if (existing) {
      Object.assign(existing, data);
      return existing;
    }
    const qc: ItemQualityControl = { id: genId("QC"), ...data };
    qcRecords.push(qc);
    return qc;
  },

  // Photos
  async getPhotos(inventoryItemId: string): Promise<ItemPhoto[]> {
    await delay();
    return photos.filter((p) => p.inventoryItemId === inventoryItemId);
  },
  async addPhoto(data: Omit<ItemPhoto, "id" | "createdAt">): Promise<ItemPhoto> {
    await delay();
    const p: ItemPhoto = { id: genId("PH"), ...data, createdAt: new Date().toISOString() };
    photos.push(p);
    return p;
  },
  async deletePhoto(id: string): Promise<void> {
    await delay();
    photos = photos.filter((p) => p.id !== id);
  },

  // Simulate video analysis
  async triggerVideoAnalysis(roomId: string): Promise<void> {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    room.videoAnalysisStatus = "uploading";
    await delay(800);
    room.videoAnalysisStatus = "processing";
    await delay(2000);
    // Add dummy detected items
    const detectedItems: ItemStatus[] = [
      { id: genId("ITM"), roomId, inventoryItemId: genId("INV"), itemName: "Bookshelf (Wooden)", isPacked: false, isHighValue: false, isFragile: false },
      { id: genId("ITM"), roomId, inventoryItemId: genId("INV"), itemName: "Floor Lamp", isPacked: false, isHighValue: false, isFragile: true },
      { id: genId("ITM"), roomId, inventoryItemId: genId("INV"), itemName: "Area Rug (8x10)", isPacked: false, isHighValue: false, isFragile: false },
    ];
    items.push(...detectedItems);
    room.videoAnalysisStatus = "completed";
    room.detectedItemsCount = (room.detectedItemsCount || 0) + detectedItems.length;
  },
};
