const walletAuthenticationWriteLockName = 'leather:wallet-authentication-write';

export async function withWalletAuthenticationWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof navigator === 'undefined' || !('locks' in navigator) || !navigator.locks)
    throw new Error('Wallet writes cannot be serialized without the Web Locks API');
  return navigator.locks.request(walletAuthenticationWriteLockName, { mode: 'exclusive' }, fn);
}
