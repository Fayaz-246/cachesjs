export function parseTimeToMs(time: string): number {
  const regex = /(\d+)(ms|s|m|h|d)/g;
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  let totalMs = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(time)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];
    totalMs += value * multipliers[unit];
  }

  if (totalMs === 0) {
    throw new Error(`Invalid time string: "${time}"`);
  }

  return totalMs;
}

export function hash(obj: any): string {
  if (obj === null) return "null";
  if (typeof obj !== "object") return String(obj);
  if (Array.isArray(obj)) return `[${obj.map(hash).join(",")}]`;

  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${k}:${hash(obj[k])}`).join(",")}}`;
}
