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
