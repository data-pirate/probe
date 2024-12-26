import { Probe } from "../src";
import { complexData } from "./fixtures/complexTestData";
import { ProbeResult } from "../src/types";
import { ProbeError } from "../src/errors";

describe("Probe Comprehensive Tests", () => {
  let probe: Probe;

  beforeEach(() => {
    probe = new Probe(complexData);
  });

  describe("Deep Nesting Tests", () => {
    it("finds values at various depths", () => {
      const allIds = probe.find("id", "all") as ProbeResult[];
      expect(allIds).toHaveLength(13); // All 'id' occurrences in nested structure

      const values = new Set(allIds.map((r) => r.value));
      expect(values.size).toBeLessThan(allIds.length); // Some IDs should be duplicates
    });

    it("respects maxDepth option", () => {
      const limitedProbe = new Probe(complexData, { maxDepth: 3 });
      const results = limitedProbe.find("id", "all") as ProbeResult[];
      expect(results.length).toBeLessThan(6); // Should not find deeply nested IDs
    });
  });

  describe("Array Handling", () => {
    it("traverses arrays correctly", () => {
      const values = probe.findWhere(
        (_, key) => key === "value"
      ) as ProbeResult[];
      expect(values).toHaveLength(4); // All 'value' keys in arrays
    });

    it("handles empty arrays", () => {
      const result = probe.findByPath("arrays.empty");
      expect(result?.value).toEqual([]);
    });

    it("processes mixed-type arrays", () => {
      const mixed = probe.findByPath("arrays.mixed");
      expect(Array.isArray(mixed?.value)).toBe(true);
      expect((mixed?.value as any[]).length).toBe(4);
    });
  });

  describe("Value Edge Cases", () => {
    it("handles special number values", () => {
      const infinity = probe.findByPath("edgeCases.infinity");
      expect(infinity?.value).toBe(Infinity);

      const nan = probe.findByPath("edgeCases.nan");
      expect(isNaN(nan?.value as number)).toBe(true);
    });

    it("distinguishes between empty values", () => {
      const emptyString = probe.findByPath("edgeCases.empty");
      const emptyObject = probe.findByPath("empty.object");
      const emptyArray = probe.findByPath("empty.array");

      expect(emptyString?.value).toBe("");
      expect(emptyObject?.value).toEqual({});
      expect(emptyArray?.value).toEqual([]);
    });

    it("handles falsy values correctly", () => {
      const results = probe.findWhere((value) => !value);
      const values = results.map((r) => r.value);

      expect(values).toContain(false);
      expect(values).toContain(null);
      expect(values).toContain("");
      expect(values).toContain(0);
    });
  });

  describe("Special Key Handling", () => {
    it("finds keys with special characters", () => {
      const dotKey = probe.findByPath("special.key");
      expect(dotKey).toBeDefined();

      const spaceKey = probe.find("special key");
      expect(spaceKey).toBeDefined();
    });

    it("handles unicode keys", () => {
      const emojiResult = probe.findByPath("unicode.😀");
      expect(emojiResult?.value).toBe("emoji key");

      const japaneseResult = probe.findByPath("unicode.データ");
      expect(japaneseResult?.value).toBe("japanese");
    });

    it("protects against prototype pollution", () => {
      const result = probe.findByPath("__proto__.polluted");
      expect(result?.value).toBe(undefined);
      expect({}.hasOwnProperty("polluted")).toBe(false);
    });
  });

  describe("Path Handling", () => {
    it("handles complex path patterns", () => {
      const customProbe = new Probe(complexData, { pathDelimiter: "+" });

      const result = customProbe.findByPath("paths+x/y+z");
      expect(result?.value).toBe("value");
    });

    it("validates paths correctly", () => {
      expect(() => probe.findByPath("")).toThrow();
      expect(() => probe.findByPath(".")).toThrow();
      expect(() => probe.findByPath("..")).toThrow();
    });
  });

  describe("Type Coercion and Comparison", () => {
    it("performs strict comparisons", () => {
      const numericResults = probe.findWhere((value) => value === 123);
      const stringResults = probe.findWhere((value) => value === "123");

      expect(numericResults).toHaveLength(0); // Should not find '123' when looking for 123
      expect(stringResults.length).toBe(1); // Should find the string '123'
    });
  });

  describe("Performance and Caching", () => {
    it("caches results effectively", () => {
      const startStats = probe.getStatistics();

      // First search
      probe.find("id", "all");
      const midStats = probe.getStatistics();
      expect(midStats.cacheMisses).toBe(startStats.cacheMisses + 1);

      // Second search (should use cache)
      probe.find("id", "all");
      const endStats = probe.getStatistics();
      expect(endStats.cacheHits).toBe(midStats.cacheHits + 1);
      expect(endStats.cacheMisses).toBe(midStats.cacheMisses);
    });

    it("measures search time accurately", () => {
      probe.find("id", "all");
      const stats = probe.getStatistics();
      expect(stats.averageSearchTime).toBeGreaterThan(0);
      expect(stats.averageSearchTime).toBeLessThan(1000); // Should be reasonably fast
    });
  });

  describe("Error Cases", () => {
    it("handles invalid inputs gracefully", () => {
      expect(() => new Probe(null as any)).toThrow(ProbeError);
      expect(() => new Probe(undefined as any)).toThrow(ProbeError);
      expect(() => new Probe("string" as any)).toThrow(ProbeError);
    });

    it("validates options strictly", () => {
      expect(() => new Probe(complexData, { maxDepth: -1 })).toThrow(
        ProbeError
      );
      expect(() => new Probe(complexData, { pathDelimiter: "" })).toThrow(
        ProbeError
      );
    });

    it("handles predicate errors", () => {
      expect(() => {
        probe.findWhere(() => {
          throw new Error("Predicate error");
        });
      }).toThrow();
    });
  });

  describe("Edge Case Combinations", () => {
    it("handles nested empty containers", () => {
      const results = probe.findWhere((value) => {
        if (typeof value === "object" && value !== null) {
          return Object.keys(value).length === 0;
        }
        return false;
      });
      expect(results.length).toBeGreaterThan(2); // Should find multiple empty objects/arrays
    });

    it("handles deeply nested arrays with duplicate keys", () => {
      const comments = probe.findByPath(
        "deepArrays.users.0.posts.0.comments"
      ) as ProbeResult;
      expect(Array.isArray(comments.value)).toBe(true);
      expect((comments.value as any[]).length).toBe(2);
    });
  });
});
