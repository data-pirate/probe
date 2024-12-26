/**
 * Cross-environment timing utility
 */
export const getTime = (): number => {
  if (typeof performance !== "undefined") {
    return performance.now(); // Browser environment
  } else {
    const [seconds, nanoseconds] = process.hrtime(); // Node.js environment
    return seconds * 1000 + nanoseconds / 1e6; // Convert to milliseconds
  }
};
