export type AlertSeverity = 'danger' | 'warning' | 'info';
export type AlertType = 'weather' | 'pest' | 'soil' | 'ndvi' | 'irrigation';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}
