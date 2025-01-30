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

  // try {
  //   console.log("Test 1: Insert a new key-value pair");
  //   db.insert("user1", {
  //     name: "alice",
  //     age: 22,
  //     email: "test@mail.com",
  //   });
  //   console.log("✔️ Passed: Successfully inserted key-value pair");
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.log("❌ Failed: " + error.message);
  //   } else {
  //     console.log("❌ Failed: Unexpected error type");
  //   }
  // }
  try {
    console.log("Test 1: get a new key-value pair");
    let user = db.get("user1");
    console.log({ user });

    console.log("✔️ Passed: Successfully inserted key-value pair");
  } catch (error) {
    if (error instanceof Error) {
      console.log("❌ Failed: " + error.message);
    } else {
      console.log("❌ Failed: Unexpected error type");
    }
  }
  // Introduce a 3-second delay before updating
  // await delay(5000);

  // try {
  //   console.log("Test 2: Update an existing key-value pair");
  //   db.update("user1", {
  //     name: "wonderland",
  //     age: 25,
  //     sex: "male",
  //   });
  //   console.log("✔️ Passed: Successfully updated key-value pair");
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.log("❌ Failed: " + error.message);
  //   } else {
  //     console.log("❌ Failed: Unexpected error type");
  //   }
  // }

  // try {
  //   console.log("Test 3: delete an existing key-value pair");
  //   db.delete("user1");
  //   console.log("✔️ Passed: Successfully updated key-value pair");
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.log("❌ Failed: " + error.message);
  //   } else {
  //     console.log("❌ Failed: Unexpected error type");
  //   }
  // }
}

// Run the tests
runTests();
