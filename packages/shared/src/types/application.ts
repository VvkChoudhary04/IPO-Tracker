import { InvestorCategory } from './applicant.js';
import { IpoRegistrar } from './ipo.js';

export type AllotmentStatus = 
  | 'AWAITING_RESULT' 
  | 'ALLOTTED' 
  | 'NOT_ALLOTTED' 
  | 'REFUND_INITIATED';

export type VerificationState = 
  | 'VERIFIED_OFFICIAL' 
  | 'PENDING_CHECK' 
  | 'REGISTRAR_BUSY' 
  | 'MANUAL_VERIFICATION_REQUIRED';

export interface ApplicationTrackingItem {
  id: string;
  applicantId: string;
  applicantName: string;
  maskedPan: string;
  ipoId: string;
  ipoName: string;
  ipoSymbol?: string;
  applicationNumber: string;
  category: InvestorCategory;
  lotsApplied: number;
  sharesApplied: number;
  bidAmount: number;
  status: AllotmentStatus;
  verificationState: VerificationState;
  sharesAllotted: number;
  refundAmount?: number;
  registrar: IpoRegistrar;
  registrarDisplayName?: string;
  appliedAt: string;
  lastCheckedAt?: string;
  allotmentDate?: string;
}
