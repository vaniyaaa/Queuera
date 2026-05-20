export type Platform = 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN';

export interface ConnectedAccount {
  _id: string;
  platform: Platform;
  platformAccountId: string;
  platformAccountName: string;
  scope: string;
  isActive: boolean;
  createdAt: string;
}
