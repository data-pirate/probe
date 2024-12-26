/**
 * Base error class for Probe operations
 */
export class ProbeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProbeError";
    Object.setPrototypeOf(this, ProbeError.prototype);
  }
}

/**
 * Error thrown for invalid path operations
 */
export class PathError extends ProbeError {
  constructor(path: string, reason: string) {
    super(`Invalid path "${path}": ${reason}`);
    this.name = "PathError";
    Object.setPrototypeOf(this, PathError.prototype);
  }
}

/**
 * Error thrown for invalid key operations
 */
export class KeyError extends ProbeError {
  constructor(key: string, reason: string) {
    super(`Invalid key "${key}": ${reason}`);
    this.name = "KeyError";
    Object.setPrototypeOf(this, KeyError.prototype);
  }
}

/**
 * Error thrown when circular references are detected
 */
export class CircularReferenceError extends ProbeError {
  constructor(path: string) {
    super(`Circular reference detected at path "${path}"`);
    this.name = "CircularReferenceError";
    Object.setPrototypeOf(this, CircularReferenceError.prototype);
  }
}

/**
 * Type guard for ProbeError
 */
export function isProbeError(error: unknown): error is ProbeError {
  return error instanceof ProbeError;
}

/**
 * Utility function to handle and wrap unknown errors
 */
export function handleError(error: unknown): never {
  if (isProbeError(error)) {
    throw error;
  }

  if (error instanceof Error) {
    throw new ProbeError(error.message);
  }

  throw new ProbeError("An unknown error occurred");
}
