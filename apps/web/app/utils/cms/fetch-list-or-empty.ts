const cmsListTimeoutMs = 5000;

function abortAfter(controller: AbortController, timeoutMs: number) {
  return new Promise<null>(resolve => {
    const timer = setTimeout(() => {
      controller.abort();
      resolve(null);
    }, timeoutMs);
    controller.signal.addEventListener('abort', () => clearTimeout(timer));
  });
}

export async function fetchListOrEmpty<T>(
  fetchList: (signal: AbortSignal) => Promise<T[] | null>,
  timeoutMs = cmsListTimeoutMs
): Promise<T[]> {
  const controller = new AbortController();
  try {
    const list = await Promise.race([
      fetchList(controller.signal),
      abortAfter(controller, timeoutMs),
    ]);
    return list ?? [];
  } catch {
    return [];
  } finally {
    controller.abort();
  }
}
