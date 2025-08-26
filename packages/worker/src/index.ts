// // import "dotenv/config";
// // import { Worker } from "@temporalio/worker";



// // async function run() {
// //   const worker = await Worker.create({
// //     workflowsPath: require.resolve("./workflows"),
// //     activitiesPath: require.resolve("./activities"),
// //     taskQueue: "ai-employee"
// //   });
// //   await worker.run();
// // }
// // run().catch((e) => { console.error(e); process.exit(1); });


// import "dotenv/config";
// import { Worker, NativeConnection } from "@temporalio/worker";
// import * as activities from "./activities.js";

// async function run() {
//   // Create connection first
//   const connection = await NativeConnection.connect({
//     address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
//   });

//   const worker = await Worker.create({
//     connection,
//     namespace: process.env.TEMPORAL_NAMESPACE || "default",
    
//     // Import activities directly as object
//     activities,
    
//     // Use workflowsPath for workflows
//     workflowsPath: require.resolve("./workflows.js"),
    
//     taskQueue: "ai-employee",
    
//     // Optional: Enable logging
//     enableSDKTracing: true,
//   });
  
//   console.log("🤖 AI Employee Worker started!");
//   console.log("📡 Connected to Temporal at:", process.env.TEMPORAL_ADDRESS || "localhost:7233");
//   console.log("📝 Listening on task queue: ai-employee");
  
//   await worker.run();
// }

// run().catch((e) => { 
//   console.error("❌ Worker failed to start:", e); 
//   process.exit(1); 
// });


import "dotenv/config";
import { Worker, NativeConnection } from "@temporalio/worker";
import * as activities from "./activities.js";

async function run() {
  let connection;
  
  try {
    // Try to connect to Temporal
    console.log("🔌 Attempting to connect to Temporal at:", process.env.TEMPORAL_ADDRESS || "localhost:7233");
    
    connection = await NativeConnection.connect({
      address: process.env.TEMPORAL_ADDRESS || "localhost:8080",
    });
    
    console.log("✅ Connected to Temporal successfully!");
    
  } catch (error) {
    console.error("❌ Failed to connect to Temporal:", error.message);
    console.error("🔍 Make sure Temporal server is running on localhost:7233");
    console.error("💡 Try: docker run -d -p 7233:7233 -p 8080:8080 temporalio/auto-setup:1.25");
    process.exit(1);
  }

  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || "default",
    activities,
    workflowsPath: require.resolve("./workflows.js"),
    taskQueue: "ai-employee"
  });
  
  console.log("🤖 AI Employee Worker started!");
  console.log("📝 Listening on task queue: ai-employee");
  
  await worker.run();
}

run().catch((e) => { 
  console.error("❌ Worker failed:", e.message); 
  process.exit(1); 
});