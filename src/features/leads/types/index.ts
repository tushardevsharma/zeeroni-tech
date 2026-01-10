export interface LeadMoveDetails {
  desiredMoveOutDate: string;
  moveSize: string;
}

export interface Lead {
  leadKey: string;
  name: string;
  phoneNumber: string;
  moveDetails: LeadMoveDetails;
  metadata: Record<string, string>;
  createdAt: string;
}
