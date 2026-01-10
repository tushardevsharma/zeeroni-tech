export interface GeminiDimensions {
  height_cm: number;
  length_cm: number;
  width_cm: number;
}

export interface GeminiPackagingLayer {
  layer_order: number;
  primary_material_type: string;
  quantity_estimate: number;
  unit: string;
  packed_volume_m3?: number;
}

export type FragilityLevel = 'Low' | 'Medium' | 'High';

export interface GeminiLogistics {
  fragility: FragilityLevel;
  is_stackable: boolean;
  requires_disassembly: boolean;
  handling_priority: string;
}

export interface GeminiAnalyzedItem {
  item: string;
  quantity: string;
  timestamp_start: string;
  timestamp_end: string;
  dimensions: GeminiDimensions;
  packaging_plan: GeminiPackagingLayer[];
  logistics: GeminiLogistics;
  notes?: string;
}

export type UploadStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Queued';

export interface SurveyUpload {
  uploadId: string;
  status: UploadStatus;
  message: string | null;
  createdTimestamp: string;
  fileName?: string;
}

export interface UploadStatusResponse {
  uploadId: string;
  status: UploadStatus;
  message?: string | null;
}

export interface PresignedUrlResponse {
  uploadId: string;
  preSignedUrl: string;
}

export interface ProcessUploadResponse {
  uploadId: string;
  status: UploadStatus;
  message?: string | null;
}

// Lead types
export interface LeadMoveDetails {
  desiredMoveOutDate: string;
  moveSize: string;
}

export interface LeadMetadata {
  userAgent: string;
  ipAddress: string;
}

export interface Lead {
  leadKey: string;
  name: string;
  phoneNumber: string;
  moveDetails: LeadMoveDetails;
  metadata: LeadMetadata;
  createdAt: string;
}
