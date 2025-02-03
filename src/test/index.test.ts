import { microDB } from "../core/microDB";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  const db = new microDB();
  await db.initialize();
  db.schemaManager.registerSchema("user1", {
    age: "number",
    name: "string",
    email: "string",
  });

  try {
    console.log("Test 1: Insert a new key-value pair");
    db.insert("user1", {
      name: "alice",
      age: 22,
      email: "test@mail.com",
    });
    console.log("✔️ Passed: Successfully inserted key-value pair");
  } catch (error) {
    console.error("❌ Failed: ", error);
  }

  try {
    console.log("Test 2: Retrieve a key-value pair");
    let user = db.get("user1");
    console.log("Retrieved user:", user);
    console.log("✔️ Passed: Successfully retrieved key-value pair");
  } catch (error) {
    console.error("❌ Failed: ", error);
  }

  // await delay(2000); // Delay before updating

  // try {
  //   console.log("Test 3: Update an existing key-value pair");
  //   db.update("user1", {
  //     name: "Alice Updated",
  //     age: 25,
  //     email: "updated@mail.com",
  //   });
  //   console.log("✔️ Passed: Successfully updated key-value pair");
  // } catch (error) {
  //   console.error("❌ Failed: ", error);
  // }

  // try {
  //   console.log("Test 4: Filter records");
  //   db.insert("user2", { name: "Bob", age: 30, email: "bob@mail.com" });
  //   db.insert("user3", { name: "Alice", age: 24, email: "alice2@mail.com" });
  //   const result = db.filter({ age: { $gt: 23 } });
  //   console.log("Filtered results:", result);
  //   console.log("✔️ Passed: Successfully filtered records");
  // } catch (error) {
  //   console.error("❌ Failed: ", error);
  // }

  try {
    console.log("Test 5: Delete a key-value pair");
    db.delete("user1");
    console.log("✔️ Passed: Successfully deleted key-value pair");
  } catch (error) {
    console.error("❌ Failed: ", error);
  }
}

// Run the tests
runTests();
