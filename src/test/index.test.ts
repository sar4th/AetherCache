import { microDB } from "../core/microDB";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  const db = new microDB();
  await db.initialize();
  db.schemaManager.registerSchema("user", {
    age: "number",
    name: "string",
    email: "string",
  });

  // Insert multiple records for filtering
  db.insert("user1", { name: "Alice", age: 35, email: "test@mail.com" });
  db.insert("user2", { name: "alice", age: 2, email: "test@mail.com" });
  db.insert("user3", { name: "Bob", age: 30, email: "bob@mail.com" });
  db.insert("user4", { name: "alice", age: 22, email: "test@mail.com" });

  try {
    console.log("Test 1: Filter users with age > 25");
    let result1 = db.filter((record: { age: number }) => record.age > 25);
    console.log("Filtered Results (age > 25):", result1);
  } catch (error) {
    console.error("❌ Failed: ", error);
  }

  try {
    console.log("Test 2: Filter users with age < 25");
    let result2 = db.filter((record: { age: number }) => record.age < 25);
    console.log("Filtered Results (age < 25):", result2);
  } catch (error) {
    console.error("❌ Failed: ", error);
  }

  try {
    console.log("Test 3: Filter users whose name starts with 'A'");
    let result3 = db.filter((record: { name: string }) =>
      record.name.startsWith("A")
    );
    console.log("Filtered Results (name starts with 'A'):", result3);
  } catch (error) {
    console.error("❌ Failed: ", error);
  }

  try {
    console.log(
      "Test 4: Filter users case-insensitively whose name is 'alice'"
    );
    let result4 = db.filter(
      (record: { name: string }) => record.name.toLowerCase() === "alice"
    );
    console.log("Filtered Results (name = 'alice' case-insensitive):", result4);
  } catch (error) {
    console.error("❌ Failed: ", error);
  }

  try {
    console.log("Test 5: Filter users with age > 25 and name starts with 'A'");
    let result5 = db.filter(
      (record: { age: number; name: string }) =>
        record.age > 25 && record.name.startsWith("A")
    );
    console.log("Filtered Results (age > 25 & name starts with 'A'):", result5);
  } catch (error) {
    console.error("❌ Failed: ", error);
  }
}

// Run the tests
runTests();
