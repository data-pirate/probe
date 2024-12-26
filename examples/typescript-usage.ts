import { Probe, ProbeResult } from "probe-js";

// Define your types
interface User {
  id: string;
  name: string;
  email: string;
  profile: {
    age: number;
    address: {
      street: string;
      city: string;
      country: string;
    };
    contacts: {
      type: "email" | "phone";
      value: string;
    }[];
  };
}

interface AppData {
  users: User[];
  settings: {
    theme: "light" | "dark";
    language: string;
  };
}

// Sample data with types
const data: AppData = {
  users: [
    {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      profile: {
        age: 30,
        address: {
          street: "123 Main St",
          city: "Boston",
          country: "USA",
        },
        contacts: [
          { type: "email", value: "john.work@example.com" },
          { type: "phone", value: "+1234567890" },
        ],
      },
    },
  ],
  settings: {
    theme: "dark",
    language: "en",
  },
};

// Create typed probe instance
const probe = new Probe(data);

// Type-safe searching
interface EmailResult extends ProbeResult {
  value: string; // Narrowing the type for email values
}

// Find emails with type checking
const findEmails = (): EmailResult[] => {
  const results = probe.findWhere((value, key) => {
    return (
      (key === "email" || key === "value") &&
      typeof value === "string" &&
      value.includes("@")
    );
  }) as EmailResult[];

  return results;
};

// Find user by ID with type safety
const findUserById = (userId: string): User | undefined => {
  const result = probe.findWhere(
    (value, key) => key === "id" && value === userId
  );

  if (result.length > 0) {
    const userPath = result[0].path.split(".").slice(0, -1).join(".");
    const userData = probe.findByPath(userPath);
    return userData?.value as User;
  }

  return undefined;
};

// Type-safe address search
interface AddressResult extends ProbeResult {
  value: User["profile"]["address"];
}

const findAddresses = (): AddressResult[] => {
  return probe.findWhere(
    (value, key) => key === "address" && typeof value === "object"
  ) as AddressResult[];
};

// Examples
console.log("All email addresses:");
console.log(findEmails());

console.log("\nUser by ID:");
console.log(findUserById("user1"));

console.log("\nAll addresses:");
console.log(findAddresses());

// Type-safe path access
const userProfile = probe.findByPath("users.0.profile");
if (userProfile) {
  const profile = userProfile.value as User["profile"];
  console.log("\nUser age:", profile.age);
}

// Generic search with type inference
function findValuesByKey<T>(key: string): T[] {
  const results = probe.find(key, "all") as ProbeResult[];
  return results.map((result) => result.value as T);
}

const ages = findValuesByKey<number>("age");
console.log("\nAll ages:", ages);
