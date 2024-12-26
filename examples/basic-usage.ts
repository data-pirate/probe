import { Probe } from "probejs-core";

// Sample data structure
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    profile: {
      age: 30,
      email: "john.doe@example.com",
      preferences: {
        theme: "dark",
        email: "notifications@example.com",
      },
    },
  },
  settings: {
    email: "admin@example.com",
  },
};

// Create a new probe instance
const probe = new Probe(data);

// Basic search examples
console.log("Finding first email:");
console.log(probe.find("email"));
// Output: { value: 'john@example.com', path: 'user.email', key: 'email' }

console.log("\nFinding last email:");
console.log(probe.find("email", "last"));
// Output: { value: 'admin@example.com', path: 'settings.email', key: 'email' }

console.log("\nFinding all emails:");
console.log(probe.find("email", "all"));
// Output: Array of all email values with their paths

console.log("\nFinding by specific path:");
console.log(probe.findByPath("user.profile.preferences.theme"));
// Output: { value: 'dark', path: 'user.profile.preferences.theme', key: 'theme' }

// Performance statistics
console.log("\nPerformance Statistics:");
console.log(probe.getStatistics());
