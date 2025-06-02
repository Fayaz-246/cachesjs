import {
  ITimedCacheConstructorOps,
  ExpireCallback,
} from "../TypesAndInterfaces";
import { error, warn } from "../logs";
import { parseTimeToMs } from "../utils";

export default class TimedCache<V = any> {
  public name: string;
  private cache = new Map<string, V>();
  private timers = new Map<string, NodeJS.Timeout>();
  private expiresAt = new Map<string, number>();
  private onExpire?: ExpireCallback<V>;
  private defaultTTL: number;

  constructor(options: ITimedCacheConstructorOps<V>) {
    if (!options.name) {
      warn("No name for cache provided using default.");
      this.name = "UnnamedTimedCache";
    } else {
      this.name = options.name;
    }
    if (options.onExpire) this.onExpire = options.onExpire;

    if (!options.defaultTTL)
      warn(`${this.name} Timed Cache |  No TTL set, using default. [ 5m ]`);
    this.defaultTTL = parseTimeToMs(options.defaultTTL || "5m");
  }

  add(key: string, value: V, ttl?: string): void {
    if (this.check(key)) this.delete(key);
    const ttlMs = ttl ? parseTimeToMs(ttl) : this.defaultTTL;
    this.cache.set(key, value);
    this.expiresAt.set(key, Date.now() + ttlMs);

    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
      this.expiresAt.delete(key);
      this.onExpire?.(key, value);
    }, ttlMs);

    this.timers.set(key, timer);
  }

  get(key: string): V | undefined {
    if (!this.cache.has(key)) {
      error(`${this.name} | Timed Cache does not have key '${key}' to get`);
      return undefined;
    }
    return this.cache.get(key);
  }

  delete(key: string): boolean {
    if (!this.check(key)) {
      error(`${this.name} | Timed Cache does not have key '${key}' to delete.`);
      return false;
    }

    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
      this.timers.delete(key);
    }

    this.expiresAt.delete(key);
    return this.cache.delete(key);
  }

  check(key: string): boolean {
    return this.cache.has(key);
  }

  hasExpired(key: string): boolean {
    const expires = this.expiresAt.get(key);
    return expires !== undefined && Date.now() > expires;
  }

  clear(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.cache.clear();
    this.timers.clear();
    this.expiresAt.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  values(): V[] {
    return Array.from(this.cache.values());
  }

  entries(): [string, V][] {
    return Array.from(this.cache.entries());
  }
}
