import { captureWarning } from './sentry';

// localStorage 안전 래퍼
export const safeLocalStorageGet = (key: string, fallback: string = ''): string => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    captureWarning(`localStorage read failed (${key})`, { error: e });
    return fallback;
  }
};

export const safeLocalStorageSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    captureWarning(`localStorage write failed (${key})`, { error: e });
  }
};
