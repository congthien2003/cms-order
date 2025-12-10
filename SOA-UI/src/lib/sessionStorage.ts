export const SessionStorageKey = {
  ACCESS_TOKEN: 'accessToken',
};

export function getSessionStorage(key: string) {
  return sessionStorage.getItem(key);
}

export function setSessionStorage(key: string, value: string) {
  sessionStorage.setItem(key, value);
}

export function removeSessionStorage(key: string) {
  sessionStorage.removeItem(key);
}
