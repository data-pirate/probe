import { Probe } from "probejs-core";

// Example: Processing API Response
const apiResponse = {
  data: {
    posts: [
      {
        id: 1,
        content: "Hello world",
        metadata: {
          tags: ["javascript", "typescript"],
          urls: {
            thumbnail: "https://example.com/thumb1.jpg",
            full: "https://example.com/image1.jpg",
          },
        },
        author: {
          id: "user1",
          urls: {
            avatar: "https://example.com/avatar1.jpg",
            profile: "https://example.com/user1",
          },
        },
      },
      {
        id: 2,
        content: "Another post",
        metadata: {
          tags: ["programming"],
          urls: {
            thumbnail: "https://example.com/thumb2.jpg",
            full: "https://example.com/image2.jpg",
          },
        },
        author: {
          id: "user2",
          urls: {
            avatar: "https://example.com/avatar2.jpg",
            profile: "https://example.com/user2",
          },
        },
      },
    ],
  },
};

const probe = new Probe(apiResponse);

// Example 1: Extract all URLs for content moderation
console.log("All URLs in the response:");
const urls = probe.findWhere((value, key) => {
  return typeof value === "string" && value.startsWith("https://");
});
console.log(urls);

// Example 2: Find all tags for analytics
console.log("\nAll tags across posts:");
const tags = probe.findWhere(
  (value, key) => key === "tags" && Array.isArray(value)
);
const allTags = tags.reduce((acc: string[], result) => {
  return acc.concat(result.value as string[]);
}, []);
console.log(allTags);

// Example 3: Get all author IDs
console.log("\nAll author IDs:");
console.log(
  probe.findWhere((value, key, path) => key === "id" && path.includes("author"))
);

// Example 4: Validate all required fields
const validatePost = () => {
  const requiredFields = ["id", "content", "author"];
  const missingFields = requiredFields.filter(
    (field) => !probe.findByPath(`data.posts.0.${field}`)
  );

  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return false;
  }
  return true;
};

console.log("\nValidating post structure:");
console.log("Post is valid:", validatePost());

// Example 5: Transform URLs for development environment
const devProbe = new Probe(apiResponse);
const transformedData = JSON.parse(JSON.stringify(apiResponse)); // Deep clone

probe
  .findWhere(
    (value, key) => typeof value === "string" && value.includes("example.com")
  )
  .forEach((result) => {
    const pathArray = result.path.split(".");
    let current = transformedData;
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = result.value.replace(
      "example.com",
      "dev.example.com"
    );
  });

console.log("\nTransformed URLs for development:");
console.log(JSON.stringify(transformedData, null, 2));
