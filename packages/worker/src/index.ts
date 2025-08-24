import "dotenv/config";
import { Worker } from "@temporalio/worker";

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows"),
    activitiesPath: require.resolve("./activities"),
    taskQueue: "ai-employee"
  });
  await worker.run();
}
run().catch((e) => { console.error(e); process.exit(1); });
