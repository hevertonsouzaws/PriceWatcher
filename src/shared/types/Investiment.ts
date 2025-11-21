export interface IAssetQuote {
  assetId: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

export interface IMonitoringTarget {
  id: string;
  asset: 'BTC' | 'USD';
  targetPrice: number;
  type: 'BUY' | 'SELL';
  isActive: boolean;
}

export interface IAlertNotification {
  message: string;
  timestamp: Date;
  isRead: boolean;
}