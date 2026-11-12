import { InvestorCategory } from './applicant.js';

export type AllotmentStatus = 
  | 'AWAITING_RESULT' 
  | 'ALLOTTED' 
  | 'NOT_ALLOTTED' 
  | 'REFUND_INITIATED';

export interface ApplicationTrackingItem {
  id: string;
  applicantId: string;
  applicantName: string;
  maskedPan: string;
  ipoId: string;
  ipoName: string;
  applicationNumber: string;
  category: InvestorCategory;
  lotsApplied: number;
  sharesApplied: number;
  bidAmount: number;
  status: AllotmentStatus;
  sharesAllotted: number;
  refundAmount?: number;
  lastCheckedAt?: string;
}
