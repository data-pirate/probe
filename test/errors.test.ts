import {
  ProbeError,
  PathError,
  KeyError,
  CircularReferenceError,
  isProbeError,
} from "../src/errors";

describe("Error Classes", () => {
  describe("ProbeError", () => {
    it("creates basic probe error", () => {
      const error = new ProbeError("test error");
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ProbeError);
      expect(error.message).toBe("test error");
    });
  });

  describe("PathError", () => {
    it("creates path error", () => {
      const error = new PathError("a.b.c", "invalid path");
      expect(error).toBeInstanceOf(ProbeError);
      expect(error).toBeInstanceOf(PathError);
      expect(error.message).toContain("a.b.c");
      expect(error.message).toContain("invalid path");
    });
  });

  describe("KeyError", () => {
    it("creates key error", () => {
      const error = new KeyError("testKey", "invalid key");
      expect(error).toBeInstanceOf(ProbeError);
      expect(error).toBeInstanceOf(KeyError);
      expect(error.message).toContain("testKey");
      expect(error.message).toContain("invalid key");
    });
  });

  describe("CircularReferenceError", () => {
    it("creates circular reference error", () => {
      const error = new CircularReferenceError("a.b.c");
      expect(error).toBeInstanceOf(ProbeError);
      expect(error).toBeInstanceOf(CircularReferenceError);
      expect(error.message).toContain("a.b.c");
    });
  });

  describe("isProbeError", () => {
    it("identifies probe errors correctly", () => {
      expect(isProbeError(new ProbeError("test"))).toBe(true);
      expect(isProbeError(new PathError("path", "test"))).toBe(true);
      expect(isProbeError(new Error("test"))).toBe(false);
      expect(isProbeError("string")).toBe(false);
      expect(isProbeError(null)).toBe(false);
    });
  });
});
