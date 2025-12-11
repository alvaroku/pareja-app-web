export interface NotificationRequest {
  userId: number;
  title: string;
  body: string;
  sendImmediately: boolean;
  scheduledAtUtc?: Date;
  sentAtUtc?: Date;
  additionalData?: { [key: string]: string };
}

export interface NotificationResponse {
  id: number;
  userId: number;
  title: string;
  body: string;
  isRead: boolean;
}
