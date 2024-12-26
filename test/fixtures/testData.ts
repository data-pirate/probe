import { JsonValue, JsonObject } from "../../src/types";

export const testData: Record<string, JsonValue> = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    profile: {
      age: 30,
      email: "john.doe@example.com",
      settings: {
        email: "notifications@example.com",
        theme: "dark",
      },
    },
  },
  posts: [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 2" },
  ],
  metadata: {
    lastUpdated: "2024-01-01",
    version: 1,
  },
  nullValue: null,
  emptyObject: {},
  specialChars: {
    "key.with.dots": {
      value: "test",
    },
  },
};

export const circularData = (() => {
  const obj: Record<string, JsonValue> = {
    a: {
      b: {
        c: {},
      },
    },
  };
  const aObj = obj.a as JsonObject;
  const bObj = aObj.b as JsonObject;
  bObj.circular = obj;
  return obj;
})();
