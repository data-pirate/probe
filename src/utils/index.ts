import { CircularReferenceError } from "../errors";

export function detectCircular(
  obj: any,
  path: string[] = [],
  seen = new WeakSet()
): void {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  if (seen.has(obj)) {
    throw new CircularReferenceError(path.join("."));
  }

  seen.add(obj);

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      detectCircular(value, [...path, key], seen);
    }
  }
}

export function isPlainObject(obj: any): boolean {
  if (typeof obj !== "object" || obj === null) return false;

  const proto = Object.getPrototypeOf(obj);
  if (proto === null) return true;

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj) as unknown as T;
  }

  if (!isPlainObject(obj)) {
    return obj;
  }

  const result = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key]);
    }
  }

  return result;
}

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
