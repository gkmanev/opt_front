const STORAGE_KEY = 'device_fingerprint';

const createFingerprint = () => {
  const browserCrypto = globalThis.crypto;
  if (typeof browserCrypto?.randomUUID === 'function') return browserCrypto.randomUUID();

  const bytes = new Uint8Array(16);
  browserCrypto?.getRandomValues?.(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const getDeviceFingerprint = () => {
  if (typeof window === 'undefined') return null;

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const fingerprint = createFingerprint();
    window.localStorage.setItem(STORAGE_KEY, fingerprint);
    return fingerprint;
  } catch {
    return createFingerprint();
  }
};
