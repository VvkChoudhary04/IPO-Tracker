export type IpoIssueType = 'MAINBOARD' | 'SME';

export type IpoRegistrar = 
  | 'LINK_INTIME' 
  | 'KFINTECH' 
  | 'BIGSHARE' 
  | 'CAMEO' 
  | 'SKYLINE' 
  | 'PURVA' 
  | 'OTHER';

export type IpoStatus = 
  | 'UPCOMING' 
  | 'OPEN' 
  | 'CLOSED' 
  | 'ALLOTMENT_FINALIZED' 
  | 'LISTED';

export interface IpoItem {
  id: string;
  name: string;
  symbol: string;
  issueType: IpoIssueType;
  priceRange: {
    min: number;
    max: number;
  };
  lotSize: number;
  minInvestment: number;
  openDate: string; // ISO date string
  closeDate: string; // ISO date string
  allotmentDate: string; // ISO date string
  listingDate: string; // ISO date string
  status: IpoStatus;
  registrar: IpoRegistrar;
  registrarDisplayName: string;
  gmp?: number; // Grey Market Premium indicator (optional estimate in INR)
}
