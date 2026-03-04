import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { SessionStorageKey, getSessionStorage } from '@/lib/sessionStorage';

let connection: HubConnection | null = null;

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
}

function getHubUrl() {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl.replace(/\/+$/, '')}/hubs/orders`;
}

export function getOrderHubConnection() {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(getHubUrl(), {
      accessTokenFactory: () => {
        return getSessionStorage(SessionStorageKey.ACCESS_TOKEN) || '';
      },
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
}

export async function ensureOrderHubConnected() {
  const conn = getOrderHubConnection();

  if (conn.state === HubConnectionState.Disconnected) {
    await conn.start();
  }

  if (conn.state !== HubConnectionState.Connected) {
    return conn;
  }

  try {
    await conn.invoke('JoinAdminsGroup');
  } catch {
    // ignore
  }

  return conn;
}
