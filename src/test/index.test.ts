import { microDB } from "../core/microDB";
function runTests() {
  const db = new microDB();
  console.log("Test 1: Insert a new key-value pair");
  db.insert("user1", {
    name: "alice",
    age: 22,
    sex: "female",
  });
  try {
    db.update("user1", {
      name: "wonderland",
      age: 25,
      sex: "male",
    });
    console.log("❌ Failed: Updated a non-existent key");
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
