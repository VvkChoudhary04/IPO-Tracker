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
  defaultDematId?: string;
  isActive: boolean;
  totalApplicationsCount: number;
  createdAt: string;
}
