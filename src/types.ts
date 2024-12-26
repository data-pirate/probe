/**
 * Types of data that can be stored in a JSON-like object
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonObject
  | JsonArray;

/**
 * JSON object type
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON array type
 */
export interface JsonArray extends Array<JsonValue> {}

/**
 * Occurrence type for search operations
 */
export type OccurrenceType = "first" | "last" | "all";

/**
 * Configuration options for Probe instance
 */
export interface ProbeOptions {
  /** Whether searches should be case-sensitive */
  caseSensitive?: boolean;
  /** Maximum depth to search in nested objects */
  maxDepth?: number;
  /** Delimiter for path strings */
  pathDelimiter?: string;
  /** Whether to enable result caching */
  caching?: boolean;
}

/**
 * Result of a probe search operation
 */
export interface ProbeResult<T = JsonValue> {
  /** The found value */
  value: T;
  /** Full path to the value */
  path: string;
  /** Key of the found value */
  key: string;
}

/**
 * Performance statistics for probe operations
 */
export interface ProbeStatistics {
  /** Total number of searches performed */
  searches: number;
  /** Number of cache hits */
  cacheHits: number;
  /** Number of cache misses */
  cacheMisses: number;
  /** Average search time in milliseconds */
  averageSearchTime: number;
}
