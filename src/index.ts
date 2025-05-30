import { TCreateCacheOps } from "./TypesAndInterfaces";
import { CachedFunction } from "./classes/CachedFunction";
import TimedCache from "./classes/TimedCache";

export default function createCache<Args extends any[] = any[], R = any>(
  config: TCreateCacheOps<Args, R>,
): TimedCache<R> | CachedFunction<Args, R> {
  if (config.type === "Timed") {
    return new TimedCache<R>(config.ops);
  } else {
    return new CachedFunction<Args, R>(config.ops);
  }
}
