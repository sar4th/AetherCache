import { microDB } from "../core/microDB";
function runTests() {
  const db = new microDB();

  console.log("Test 1: Insert a new key-value pair");
  db.insert("user1", "Alice");
  console.log(db.get("user1") === "Alice" ? "✔️ Passed" : "❌ Failed");

  console.log("Test 2: Try to insert a duplicate key");
  try {
    db.insert("user1", "Bob");
    console.log("❌ Failed: Duplicate key allowed");
  } catch (error) {
    if (error instanceof Error) {
      console.log("✔️ Passed: " + error.message);
    } else {
      console.log("❌ Failed: Unexpected error type");
    }
  }

  console.log("Test 3: Retrieve a non-existent key");
  console.log(db.get("user2") === null ? "✔️ Passed" : "❌ Failed");

  console.log("Test 4: Update an existing key");
  db.update("user1", "Alice Updated");
  console.log(db.get("user1") === "Alice Updated" ? "✔️ Passed" : "❌ Failed");

  console.log("Test 5: Try to update a non-existent key");
  try {
    db.update("user2", "Bob");
    console.log("❌ Failed: Updated a non-existent key");
  } catch (error) {
    if (error instanceof Error) {
      console.log("✔️ Passed: " + error.message);
    } else {
      console.log("❌ Failed: Unexpected error type");
    }
  }

  console.log("Test 6: Delete an existing key");
  db.delete("user1");
  console.log(db.get("user1") === null ? "✔️ Passed" : "❌ Failed");

  console.log("Test 7: Try to delete a non-existent key");
  try {
    db.delete("user2");
    console.log("❌ Failed: Deleted a non-existent key");
  } catch (error) {
    if (error instanceof Error) {
      console.log("✔️ Passed: " + error.message);
    } else {
      console.log("❌ Failed: Unexpected error type");
    }
  }
}

// Run the tests
runTests();
