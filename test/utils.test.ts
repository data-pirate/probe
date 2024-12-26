import {
  detectCircular,
  isPlainObject,
  deepClone,
  memoize,
} from "../src/utils";
import { CircularReferenceError } from "../src/errors";

describe("Utility Functions", () => {
  describe("detectCircular", () => {
    it("should detect circular references", () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      expect(() => detectCircular(obj)).toThrow(CircularReferenceError);
    });

    it("should handle nested circular references", () => {
      const obj: any = { a: { b: { c: {} } } };
      obj.a.b.c.d = obj.a;

      expect(() => detectCircular(obj)).toThrow(CircularReferenceError);
    });

    it("should not throw for non-circular objects", () => {
      const obj = {
        a: 1,
        b: { c: 2 },
        d: [1, 2, 3],
      };

      expect(() => detectCircular(obj)).not.toThrow();
    });
  });

  describe("isPlainObject", () => {
    it("should identify plain objects", () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it("should reject non-plain objects", () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject(() => {})).toBe(false);
    });
  });

  describe("deepClone", () => {
    it("should clone primitive values", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone("test")).toBe("test");
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it("should clone plain objects", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it("should clone arrays", () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).not.toBe(original[1]);
      expect(cloned[2]).not.toBe(original[2]);
    });

    it("should clone dates", () => {
      const original = new Date();
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it("should clone regular expressions", () => {
      const original = /test/gi;
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe("memoize", () => {
    it("should cache function results", () => {
      let callCount = 0;
      const fn = (a: number, b: number) => {
        callCount++;
        return a + b;
      };

      const memoized = memoize(fn);

      expect(memoized(1, 2)).toBe(3);
      expect(memoized(1, 2)).toBe(3);
      expect(callCount).toBe(1);
    });

    it("should use custom resolver", () => {
      let callCount = 0;
      const fn = (a: { x: number }, b: { y: number }) => {
        callCount++;
        return a.x + b.y;
      };

      const memoized = memoize(fn, (a, b) => `${a.x}-${b.y}`);

      expect(memoized({ x: 1 }, { y: 2 })).toBe(3);
      expect(memoized({ x: 1 }, { y: 2 })).toBe(3);
      expect(callCount).toBe(1);
    });
  });
});
