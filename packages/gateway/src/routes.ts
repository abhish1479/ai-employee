import { Router } from "express";
import { getTemporalClient } from "./temporalClient.js";
import axios from "axios";

const r = Router();

/** Start lead_to_quote workflow (demo) */
r.post("/events/lead-created", async (req, res) => {
  const { leadId, email } = req.body;
  const client = await getTemporalClient();
  const handle = await client.workflow.start("leadToQuote", {
    taskQueue: "ai-employee",
    workflowId: `lead-${leadId}`,
    args: [{ leadId, email }]
  });
  res.json({ workflowId: handle.workflowId, runId: handle.firstExecutionRunId });
});

/** Talk-to-me: query workflow summary */
r.get("/talk/:id", async (req, res) => {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(req.params.id);
  const summary = await handle.query("managerSummary");
  res.json(summary);
});

/** Policy check example */
r.post("/policy/check", async (req, res) => {
  const allow = await axios.post(process.env.OPA_URL!, { input: req.body }).then(r => r.data.result === true);
  res.json({ allow });
});

/** Realtime token minting (WebRTC) */
r.post("/realtime/token", async (req, res) => {
  // Basic server-side session creation for OpenAI Realtime
  const resp = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview",
      voice: "verse",                 // or another builtin voice
      modalities: ["audio","text"],
      // Optional: instructions or tool schema here
    })
  });
  const json = await resp.json();
  res.json(json); // client receives { client_secret: "...", id: "...", ... }
});

export default r;
