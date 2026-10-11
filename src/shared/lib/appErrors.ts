export interface AppErrorNotice {
  id: number;
  message: string;
}

let currentNotice: AppErrorNotice | null = null;
let nextNoticeId = 0;
const subscribers = new Set<() => void>();

export function reportAppError(error: unknown, fallback: string): void {
  const message =
    error instanceof Error && error.message.trim()
      ? error.message
      : fallback;

  currentNotice = { id: ++nextNoticeId, message };
  subscribers.forEach((subscriber) => subscriber());
}

export function dismissAppError(id: number): void {
  if (currentNotice?.id !== id) return;

  currentNotice = null;
  subscribers.forEach((subscriber) => subscriber());
}

export function subscribeToAppErrors(subscriber: () => void): () => void {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
}

export function getAppErrorSnapshot(): AppErrorNotice | null {
  return currentNotice;
}