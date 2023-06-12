export interface ILog {
  timestamp: Date;

  resource: string;

  userId: string;

  action: 'added' | 'spent' | 'rewarded';

  credits: number;
}
