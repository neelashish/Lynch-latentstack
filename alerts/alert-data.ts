export type AlertStatus = 'active' | 'triggered' | 'disabled';
export type ActivitySeverity = 'info' | 'success' | 'warning' | 'danger' | 'critical';
export type ActivityType = 'alert_triggered' | 'alert_created' | 'alert_toggled' | 'simulated_event';

export interface Alert {
  id: string;
  symbol: string;
  condition: string;
  status: AlertStatus;
  createdAt: string;
  threshold?: string | number;
  enabled?: boolean;
}

export interface ActivityDetails {
  metric?: string;
  previousValue?: string | number;
  newValue?: string | number;
  reason?: string;
  recommendation?: string;
  [key: string]: unknown;
}

export interface Activity {
  id: string;
  type: ActivityType | string;
  alertId?: string;
  symbol: string;
  title: string;
  description: string;
  timestamp: string;
  severity: ActivitySeverity;
  details?: ActivityDetails;
  lynchView?: string;
  confidence?: number | string;
  risk?: string;
}

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    symbol: 'RELIANCE',
    condition: 'Risk increases beyond 75%',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    threshold: 75,
    enabled: true,
  },
  {
    id: 'alt-2',
    symbol: 'TCS',
    condition: 'Momentum becomes positive',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    threshold: 0,
    enabled: true,
  },
  {
    id: 'alt-3',
    symbol: 'INFY',
    condition: 'Volatility increases above 25%',
    status: 'disabled',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    threshold: 25,
    enabled: false,
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'alert_triggered',
    symbol: 'RELIANCE',
    title: 'Risk Spike Detected',
    description: 'RELIANCE risk score increased significantly due to market volatility.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    severity: 'danger',
    details: {
      metric: 'Risk Score',
      previousValue: '58/100',
      newValue: '78/100',
      reason: 'Sudden increase in sectoral downside momentum and elevated short interest.',
      recommendation: 'Review position sizing or evaluate downside hedge strategies.',
    },
    lynchView: 'Bearish short-term outlook due to sectoral pressure.',
    confidence: '85%',
    risk: 'High',
  },
  {
    id: 'act-2',
    type: 'alert_triggered',
    symbol: 'TCS',
    title: 'Momentum Shift Positive',
    description: 'TCS moving average convergence turned positive.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    severity: 'success',
    details: {
      metric: 'Momentum Index',
      previousValue: '-0.15',
      newValue: '+0.42',
      reason: 'Breakout above 20-day moving average accompanied by strong volume.',
      recommendation: 'Consider adding momentum-following long exposure.',
    },
    lynchView: 'Bullish turn supported by volume trends.',
    confidence: '90%',
    risk: 'Medium',
  },
  {
    id: 'act-3',
    type: 'alert_created',
    symbol: 'INFY',
    title: 'Alert Configured',
    description: 'Volatility increase alert created for INFY.',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    severity: 'info',
    details: {
      metric: 'Volatility Threshold',
      newValue: '25%',
      reason: 'User created alert configuration for tracking INFY earnings volatility.',
    },
    lynchView: 'Neutral holding ahead of upcoming earnings release.',
    confidence: '70%',
    risk: 'Low',
  },
];

const ALERTS_STORAGE_KEY = 'lynch_alerts_data';
const ACTIVITIES_STORAGE_KEY = 'lynch_activities_data';

export const getStoredAlerts = (): Alert[] => {
  if (typeof window === 'undefined') return INITIAL_ALERTS;
  try {
    const item = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
      return INITIAL_ALERTS;
    }
    return JSON.parse(item);
  } catch {
    return INITIAL_ALERTS;
  }
};

export const saveStoredAlerts = (alerts: Alert[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (err) {
    console.error('Failed to save alerts to localStorage:', err);
  }
};

export const getStoredActivities = (): Activity[] => {
  if (typeof window === 'undefined') return INITIAL_ACTIVITIES;
  try {
    const item = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(item);
  } catch {
    return INITIAL_ACTIVITIES;
  }
};

export const saveStoredActivities = (activities: Activity[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.error('Failed to save activities to localStorage:', err);
  }
};
