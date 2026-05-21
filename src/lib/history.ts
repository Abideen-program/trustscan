// lib/history.ts

const HISTORY_KEY = 'trustscan_history';
const MAX_ITEMS = 10;

export type HistoryItem = {
  id: string;
  risk_score: number;
  verdict: 'safe' | 'suspicious' | 'high_risk';
  summary: string;
  input_type: 'text' | 'url' | 'image';
  preview: string;
  scanned_at: string;
};

export function saveToHistory(item: Omit<HistoryItem, 'scanned_at'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getHistory();
    // Check if it already exists
    const alreadyExists = existing.some((h) => h.id === item.id);
    if (alreadyExists) return;

    const newItem: HistoryItem = {
      ...item,
      scanned_at: new Date().toISOString(),
    };

    const updated = [newItem, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    
    // Dispatch custom event to notify components that history updated
    window.dispatchEvent(new Event('trustscan_history_update'));
  } catch (e) {
    console.error('Failed to save to scan history:', e);
  }
}

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    return parsed;
  } catch (e) {
    console.error('Failed to retrieve scan history:', e);
    return [];
  }
}

export function deleteFromHistory(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = getHistory().filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('trustscan_history_update'));
  } catch (e) {
    console.error('Failed to delete history item:', e);
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event('trustscan_history_update'));
  } catch (e) {
    console.error('Failed to clear scan history:', e);
  }
}
