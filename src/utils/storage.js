// localStorage 안전 래퍼
export const safeLocalStorageGet = (key, fallback = '') => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    console.warn(`localStorage read failed (${key})`, e);
    return fallback;
  }
};

export const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage write failed (${key})`, e);
  }
};
