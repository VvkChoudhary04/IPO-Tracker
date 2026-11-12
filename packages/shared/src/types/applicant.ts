export type InvestorCategory = 
  | 'RETAIL' 
  | 'SHNI' // Small HNI (2L - 10L)
  | 'BHNI' // Big HNI (> 10L)
  | 'EMPLOYEE' 
  | 'SHAREHOLDER';

export interface ApplicantProfileSummary {
  id: string;
  fullName: string;
  maskedPan: string; // e.g. "ABCDE****F"
  category: InvestorCategory;
  email?: string;
  phoneMasked?: string;
  dematAccount?: string; // 16-digit masked DP/Client ID
  isActive: boolean;
  totalApplicationsCount: number;
  consentGiven: boolean;
  consentDate: string;
  createdAt: string;
}
