import { JsonValue } from "../../src/types";

// Complex nested structure with various data types and edge cases
export const complexData: Record<string, JsonValue> = {
  // Deep nesting with repeated keys
  nested: {
    level1: {
      id: 1,
      level2: {
        id: 2,
        level3: {
          id: 3,
          data: "value",
        },
      },
    },
  },

  // Array handling
  arrays: {
    simple: [1, 2, 3],
    objects: [
      { id: 1, value: "first" },
      { id: 2, value: "second" },
    ],
    nested: [
      {
        items: [
          { id: "a", value: "nested-1" },
          { id: "b", value: "nested-2" },
        ],
      },
    ],
    mixed: [1, "string", null, { key: "value" }],
    empty: [],
  },

  // Edge cases for values
  edgeCases: {
    zero: 0,
    negativeZero: -0,
    empty: "",
    nullValue: null,
    truth: true,
    falsy: false,
    maxNumber: Number.MAX_SAFE_INTEGER,
    minNumber: Number.MIN_SAFE_INTEGER,
    infinity: Infinity,
    negativeInfinity: -Infinity,
    nan: NaN,
  },

  // Special characters in keys
  "special.key": "dot in key",
  "special[key]": "brackets in key",
  "special@key": "at sign in key",
  "special key": "space in key",
  "": "empty key", // Edge case
  "123": "numeric key",

  // Unicode characters
  unicode: {
    "😀": "emoji key",
    résumé: "accented chars",
    データ: "japanese",
    кириллица: "cyrillic",
  },

  // Deep equality edge cases
  equality: {
    obj1: { a: 1, b: 2 },
    obj2: { b: 2, a: 1 }, // Same content, different order
    nestedEqual1: { a: { b: { c: 1 } } },
    nestedEqual2: { a: { b: { c: 1 } } },
  },

  // Path traversal edge cases
  paths: {
    a: {
      "b.c": {
        d: "value",
      },
    },
    "x/y": {
      z: "value",
    },
  },

  // Type coercion cases
  coercion: {
    numericString: "123",
    booleanString: "true",
    arrayLike: { length: 1, 0: "zero" },
  },

  // Same value references
  references: (() => {
    const sharedValue = { id: "shared" };
    return {
      ref1: sharedValue,
      ref2: sharedValue,
    };
  })(),

  // Prototype pollution attempt
  __proto__: {
    polluted: true,
  },

  // Deeply nested array with same keys
  deepArrays: {
    users: [
      {
        id: 1,
        posts: [
          {
            id: 1,
            comments: [
              { id: 1, text: "comment 1" },
              { id: 2, text: "comment 2" },
            ],
          },
        ],
      },
    ],
  },

  // Empty containers
  empty: {
    object: {},
    array: [],
    string: "",
    mixed: {
      empty: {},
      nested: {
        empty: {},
      },
    },
  },
};
