import { error, warn } from "console";
import {
  AsyncCacheFunc,
  CacheFunc,
  ICachedFunctionConstructorOps,
} from "../TypesAndInterfaces";
import { hash, parseTimeToMs } from "../utils";
import { info } from "../logs";
import TimedCache from "./TimedCache";

export class CachedFunction<Args extends any[] = any, R = any> {
  public name: string;
  protected ttl: number;
  protected func: CacheFunc<Args, R> | AsyncCacheFunc<Args, R>;
  protected cache: TimedCache<R | Promise<R>>;

  constructor(options: ICachedFunctionConstructorOps<Args, R>) {
    if (!options.name) {
      warn("No name for cache using defaults.");
      this.name = "UnamedCachedFunction";
    } else {
      this.name = options.name;
    }

    if (!options.func)
      error(
        `${this.name} Cached Function | No function provided in constructor. [ Using Void Function ]`,
      );
    this.func =
      options.func ||
      (() => {
        info(
          `${this.name} Cached Function | Has no function, provide one through the constructor`,
        );
      });

    if (!options.ttl)
      warn(`${this.name} Cached Function | No TTL set, using default. [ 5m ]`);
    this.ttl = parseTimeToMs(options.ttl || "5m");

    this.cache = new TimedCache<R | Promise<R>>({
      name: `${this.name}-TimedCache`,
      defaultTTL: options.ttl || "5m",
    });
  }

  runSync(...args: Args): R {
    if (this.isAsyncFunction(this.func)) {
      throw new Error(
        `${this.name} Cached Function | Cannot run async function with runSync`,
      );
    }
    const key = hash({ args });

    if (this.cache.check(key)) return this.cache.get(key) as R;

    const res = this.func(...args);
    this.cache.add(key, res);
    return res as R;
  }

  async runAsync(...args: Args): Promise<R> {
    const key = hash({ args });
    if (this.cache.check(key)) return this.cache.get(key) as Promise<R>;

    try {
      const res = await this.func(...args);
      this.cache.add(key, res);
      return res as Promise<R>;
    } catch (error: any | unknown) {
      throw new Error(error);
    }
  }

  getCachedValue(...args: Args): R | Promise<R> | undefined {
    const key = hash({ args });
    if (!this.cache.check(key)) {
      warn(
        `${this.name} Cached Function | Key ${key} does not exist in result cache.`,
      );
      return undefined;
    }
    return this.cache.get(key);
  }

  clear() {
    return this.cache.clear();
  }

  has(...args: Args): boolean {
    const key = hash({ args });
    return this.cache.check(key);
  }

  private isAsyncFunction(
    fn: CacheFunc<Args, R> | AsyncCacheFunc<Args, R>,
  ): fn is AsyncCacheFunc<Args, R> {
    return fn.constructor.name === "AsyncFunction";
  }
}
