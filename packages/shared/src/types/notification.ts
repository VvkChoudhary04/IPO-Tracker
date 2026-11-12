export type NotificationType = 
  | 'ALLOTMENT_FINALIZED' 
  | 'ALLOTMENT_SUCCESS' 
  | 'NOT_ALLOTTED' 
  | 'BIDDING_CLOSING' 
  | 'SYSTEM_NOTICE';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  ipoId?: string;
  applicantId?: string;
  link?: string;
}
