import { useCallback, useEffect, useRef, useState } from 'react';

const copiedResetMs = 1400;

async function writeToClipboard(value: string) {
  if (!navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function useClipboardCopy() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latestRequestRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(async (value: string) => {
    latestRequestRef.current += 1;
    const request = latestRequestRef.current;
    const hasWritten = await writeToClipboard(value);
    if (!isMountedRef.current || request !== latestRequestRef.current) return undefined;

    clearTimeout(timeoutRef.current);
    setCopied(hasWritten);
    if (hasWritten) timeoutRef.current = setTimeout(() => setCopied(false), copiedResetMs);
    return hasWritten;
  }, []);

  return { copied, copy };
}
