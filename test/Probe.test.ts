import { Probe } from "../src";
import { testData } from "./fixtures/testData";
import { ProbeError } from "../src/errors";
import { ProbeResult } from "../src/types";

describe("Probe", () => {
  let probe: Probe;

  beforeEach(() => {
    probe = new Probe(testData);
  });

  describe("constructor", () => {
    it("creates instance with default options", () => {
      expect(probe).toBeInstanceOf(Probe);
    });

    it("accepts custom options", () => {
      const customProbe = new Probe(testData, {
        caseSensitive: false,
        maxDepth: 3,
        pathDelimiter: "/",
        caching: false,
      });
      expect(customProbe).toBeInstanceOf(Probe);
    });

    it("throws on invalid options", () => {
      expect(() => new Probe(testData, { maxDepth: -1 })).toThrow(ProbeError);
    });
  });

  describe("find", () => {
    it("finds first occurrence of a key", () => {
      const result = probe.find("email") as ProbeResult;
      expect(result).toBeDefined();
      expect(result.value).toBe("john@example.com");
      expect(result.path).toBe("user.email");
    });

    it("finds last occurrence of a key", () => {
      const result = probe.find("email", "last") as ProbeResult;
      expect(result).toBeDefined();
      expect(result.value).toBe("notifications@example.com");
    });

    it("finds all occurrences of a key", () => {
      const results = probe.find("email", "all") as ProbeResult[];
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(typeof result.value).toBe("string");
        expect(result.value).toContain("@");
      });
    });

    it("returns undefined for non-existent key", () => {
      const result = probe.find("nonexistent");
      expect(result).toBeUndefined();
    });
  });

  describe("findByPath", () => {
    it("finds value at exact path", () => {
      const result = probe.findByPath("user.profile.age");
      expect(result).toBeDefined();
      expect(result?.value).toBe(30);
    });
  });

  describe("findWhere", () => {
    it("finds values matching predicate", () => {
      const results = probe.findWhere((value) => typeof value === "number");
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(typeof result.value).toBe("number");
      });
    });

    it("finds values with custom predicate", () => {
      const results = probe.findWhere(
        (value, key) => key === "email" && typeof value === "string"
      );
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.value).toContain("@");
      });
    });
  });

  describe("performance features", () => {
    it("tracks statistics", () => {
      probe.find("email");
      probe.find("email"); // Second call should use cache
      const stats = probe.getStatistics();
      expect(stats.searches).toBe(2);
      expect(stats.cacheHits + stats.cacheMisses).toBe(2);
    });
  });
});
