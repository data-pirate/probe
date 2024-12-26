import { Probe } from "probejs-core";

// Complex nested data structure
const data = {
  company: {
    departments: [
      {
        name: "Engineering",
        budget: 100000,
        teams: [
          { name: "Frontend", budget: 40000 },
          { name: "Backend", budget: 60000 },
        ],
      },
      {
        name: "Marketing",
        budget: 80000,
        teams: [
          { name: "Digital", budget: 50000 },
          { name: "Traditional", budget: 30000 },
        ],
      },
    ],
  },
  metadata: {
    lastUpdated: "2024-01-01",
    budget: 180000,
  },
};

// Create probe with custom options
const probe = new Probe(data, {
  caseSensitive: false, // Case-insensitive search
  maxDepth: 5, // Limit search depth
  pathDelimiter: "/", // Custom path delimiter
  caching: true, // Enable caching
});

// Find all budgets using predicate
console.log("Finding all budgets over 50000:");
const highBudgets = probe.findWhere(
  (value, key) => key === "budget" && typeof value === "number" && value > 50000
);
console.log(highBudgets);

// Case-insensitive search
console.log("\nFinding values with case-insensitive search:");
console.log(probe.find("BUDGET", "all"));

// Using custom path delimiter
console.log("\nFinding using custom path delimiter:");
console.log(probe.findByPath("company/departments/0/name"));

// Demonstrating caching
console.log("\nDemonstrating caching:");
console.time("First search");
probe.find("budget", "all");
console.timeEnd("First search");

console.time("Second search (cached)");
probe.find("budget", "all");
console.timeEnd("Second search (cached)");

// Clear cache and search again
probe.clearCache();
console.time("Third search (cache cleared)");
probe.find("budget", "all");
console.timeEnd("Third search (cache cleared)");

// Show performance statistics
console.log("\nPerformance Statistics:");
console.log(probe.getStatistics());
