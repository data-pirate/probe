import { ProbeOptions } from "./types";
import {
  ProbeError,
  KeyError,
  PathError,
  CircularReferenceError,
} from "./errors";

export function validateOptions(options: Required<ProbeOptions>): void {
  if (typeof options.caseSensitive !== "boolean") {
    throw new ProbeError("caseSensitive option must be a boolean");
  }

  // Changed validation for maxDepth to handle Infinity correctly
  if (typeof options.maxDepth !== "number" || options.maxDepth < 0) {
    throw new ProbeError("maxDepth must be a non-negative number");
  }

  if (typeof options.pathDelimiter !== "string" || !options.pathDelimiter) {
    throw new ProbeError("pathDelimiter must be a non-empty string");
  }

  if (typeof options.caching !== "boolean") {
    throw new ProbeError("caching option must be a boolean");
  }
}

export function validateKey(key: string): void {
  if (typeof key !== "string") {
    throw new KeyError(String(key), "Key must be a string");
  }

  if (!key.trim()) {
    throw new KeyError(key, "Key cannot be empty");
  }
}

export function validatePath(path: string): void {
  if (!path || path === "." || path === "..") {
    throw new PathError(path, "Invalid path");
  }

  if (typeof path !== "string") {
    throw new PathError(String(path), "Path must be a string");
  }

  if (!path.trim()) {
    throw new PathError(path, "Path cannot be empty");
  }
}

export function detectCircular(
  obj: unknown,
  path: string[] = [],
  seen = new WeakSet()
): void {
  if (obj === null || typeof obj !== "object") {
    return; // Skip primitives
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

  // Remove the object from the seen set after traversal
  // This ensures that shared references don't trigger circular reference errors
  seen.delete(obj);
}
