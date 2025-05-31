export type ExpireCallback<V> = (key: string, value: V) => void;
export type CacheFunc<Args extends any[] = any[], R = any> = (
  ...args: Args
) => R;
export type AsyncCacheFunc<Args extends any[] = any[], R = any> = (
  ...args: Args
) => Promise<R>;

export interface ITimedCacheConstructorOps<V> {
  name: string;
  onExpire?: ExpireCallback<V>;
  defaultTTL?: string;
}

export interface ICachedFunctionConstructorOps<
  Args extends any[] = any[],
  R = any,
> {
  name: string;
  func: CacheFunc<Args, R> | AsyncCacheFunc<Args, R>;
  ttl?: string;
}
