const STORAGE_KEY = 'accountData';

export function getRegistrationData() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveRegistrationData(partialData) {
  const current = getRegistrationData();
  const updated = { ...current, ...partialData };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}