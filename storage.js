// Data persistence separated from main logic

export function saveCalls(calls, storageKey = "crm-calls") {
  localStorage.setItem(storageKey, JSON.stringify(calls));
}

export function loadCalls(storageKey = "crm-calls") {
  try {
    const arr = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}