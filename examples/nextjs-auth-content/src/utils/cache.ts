/**
 * Very simple ttl cache on a pure function without any args
 */
export function cachePureFn<T>(ttl_ms: number, fn: () => T): () => T {
  let _cache: T;
  let _expiresAt: number = 0;
  return () => {
    if (Date.now() < _expiresAt) {
      return _cache;
    }
    _expiresAt = Date.now() + ttl_ms;
    _cache = fn();
    return _cache;
  };
}
