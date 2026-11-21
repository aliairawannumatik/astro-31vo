let storageFailureReported = false;

const reportStorageError = (operation: string, key: string, error: unknown) => {
  if (storageFailureReported) return;
  storageFailureReported = true;
  console.warn(`Unable to ${operation} localStorage key "${key}".`, error);
};

export const readLocalStorage = (key: string): string | null => {
  try {
    return globalThis.localStorage.getItem(key);
  } catch (error) {
    reportStorageError("read", key, error);
    return null;
  }
};

export const writeLocalStorage = (key: string, value: string): void => {
  try {
    globalThis.localStorage.setItem(key, value);
  } catch (error) {
    reportStorageError("write", key, error);
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    globalThis.localStorage.removeItem(key);
  } catch (error) {
    reportStorageError("remove", key, error);
  }
};
