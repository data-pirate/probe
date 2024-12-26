import {
  JsonValue,
  ProbeOptions,
  ProbeResult,
  ProbeStatistics,
  OccurrenceType,
} from "./types";
import {
  validateOptions,
  validateKey,
  validatePath,
  detectCircular,
} from "./validation";
import { ProbeError } from "./errors";
import { getTime } from "./utils/timing";

export class Probe {
  private readonly data: JsonValue;
  private readonly options: Required<ProbeOptions>;
  private cache: Map<string, ProbeResult[]> = new Map();
  private statistics: ProbeStatistics = {
    searches: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageSearchTime: 0,
  };

  constructor(data: JsonValue, options: ProbeOptions = {}) {
    if (!data || (typeof data !== "object" && !Array.isArray(data))) {
      throw new ProbeError("Data must be a non-null object or array");
    }

    this.data = data;
    this.options = {
      caseSensitive: options.caseSensitive ?? true,
      maxDepth: options.maxDepth ?? Infinity,
      pathDelimiter: options.pathDelimiter ?? ".",
      caching: options.caching ?? true,
    };

    validateOptions(this.options);
    detectCircular(this.data);
  }

  public find(
    key: string,
    occurrence: OccurrenceType = "first"
  ): ProbeResult | ProbeResult[] | undefined {
    validateKey(key);
    const startTime = getTime();

    let results = this.getCachedResults(key);
    if (!results) {
      results = this.findAll(key);
      this.cacheResults(key, results);
    }

    this.trackSearch(startTime);
    if (results.length === 0) return undefined;

    switch (occurrence) {
      case "first":
        return results[0];
      case "last":
        return results[results.length - 1];
      case "all":
        return results || [];
      default:
        throw new ProbeError(`Invalid occurrence type: ${occurrence}`);
    }
  }

  private isProtectedKey(key: string): boolean {
    return key === "__proto__" || key === "constructor" || key === "prototype";
  }

  private handleArrayAccess(current: JsonValue[], key: string): JsonValue | undefined {
    const index = parseInt(key, 10);
    if (isNaN(index) || index < 0 || index >= current.length) {
      return undefined;
    }
    return current[index];
  }

  public findByPath(path: string): ProbeResult | undefined {
    validatePath(path);
    const startTime = getTime();
  
    try {
      const keys = path.split(this.options.pathDelimiter);
      let current: JsonValue = this.data;
  
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // Protect against prototype pollution
        if (this.isProtectedKey(key)) {
          return undefined;
        }
  
        if (current === null || typeof current !== "object") {
          return undefined;
        }
  
        if (Array.isArray(current)) {
          const result = this.handleArrayAccess(current, key);
          if (result === undefined) {
            return undefined;
          }
          current = result;
        } else {
          if (!Object.prototype.hasOwnProperty.call(current, key)) {
            // If the key doesn't exist, check if the remaining path forms a valid key
            const remainingPath = keys.slice(i).join(this.options.pathDelimiter);
  
            if (Object.prototype.hasOwnProperty.call(current, remainingPath)) {
              current = (current as Record<string, JsonValue>)[remainingPath];
              break; // Exit the loop since we've processed the full key
            }
            return undefined;
          }
          current = (current as Record<string, JsonValue>)[key];
        }
      }
  
      return {
        value: current,
        path,
        key: keys[keys.length - 1],
      };
    } finally {
      this.trackSearch(startTime);
    }
  }

  public findWhere(
    predicate: (value: JsonValue, key: string, path: string[]) => boolean
  ): ProbeResult[] {
    if (typeof predicate !== "function") {
      throw new ProbeError("Predicate must be a function");
    }

    const startTime = getTime();
    const results: ProbeResult[] = [];

    try {
      this.traverse(this.data, [], (value, key, path) => {
        if (predicate(value, key, path)) {
          results.push({
            value,
            path: path.join(this.options.pathDelimiter),
            key,
          });
        }
      });
      return results;
    } finally {
      this.trackSearch(startTime);
    }
  }

  public getStatistics(): ProbeStatistics {
    return { ...this.statistics };
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public setCaching(enabled: boolean): void {
    if (!enabled) {
      this.clearCache();
    }
    this.options.caching = enabled;
  }

  private findAll(key: string): ProbeResult[] {
    const results: ProbeResult[] = [];
    this.traverse(this.data, [], (value, currentKey, path) => {
      const normalizedKey = this.options.caseSensitive
        ? currentKey
        : currentKey.toLowerCase();
      const searchKey = this.options.caseSensitive ? key : key.toLowerCase();

      if (normalizedKey === searchKey) {
        results.push({
          value,
          path: path.join(this.options.pathDelimiter),
          key: currentKey,
        });
      }
    });
    return results;
  }

  private traverse(
    obj: JsonValue,
    path: string[],
    callback: (value: JsonValue, key: string, path: string[]) => void
  ): void {
    if (
      !obj ||
      typeof obj !== "object" ||
      path.length >= this.options.maxDepth
    ) {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((value, index) => {
        callback(value, index.toString(), [...path, index.toString()]);
        this.traverse(value, [...path, index.toString()], callback);
      });
    } else {
      for (const [key, value] of Object.entries(obj)) {
        callback(value, key, [...path, key]);
        this.traverse(value, [...path, key], callback);
      }
    }
  }

  private getCachedResults(key: string): ProbeResult[] | null {
    if (!this.options.caching) return null;

    const cached = this.cache.get(key);
    if (cached) {
      this.statistics.cacheHits++;
      return cached;
    }

    this.statistics.cacheMisses++;
    return null;
  }

  private cacheResults(key: string, results: ProbeResult[]): void {
    if (this.options.caching) {
      this.cache.set(key, results);
    }
  }

  private trackSearch(startTime: number): void {
    const searchTime = getTime() - startTime;
    this.statistics.searches++;
    this.statistics.averageSearchTime =
      (this.statistics.averageSearchTime * (this.statistics.searches - 1) +
        searchTime) /
      this.statistics.searches;
  }
}
