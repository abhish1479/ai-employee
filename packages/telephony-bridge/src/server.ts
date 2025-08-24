import "dotenv/config";
import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

/** Twilio Voice webhook (TwiML) to start media stream */
app.post("/twilio/voice", (req, res) => {
  const mediaWs = `${process.env.PUBLIC_URL || "wss://your-public-host"}/telephony/stream`;
  const twiml = `
<Response>
  <Connect>
    <Stream url="${mediaWs}" />
  </Connect>
</Response>`;
  res.set("Content-Type", "text/xml").send(twiml.trim());
});

/** WS server that talks to Twilio on one side and OpenAI Realtime on the other */
const wss = new WebSocketServer({ noServer: true });

let oaSocket: WebSocket | null = null;

async function connectOpenAIRealtime(): Promise<WebSocket> {
  const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview";
  const ws = new WebSocket(url, {
    headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` }
  });
  return await new Promise((resolve) => ws.on("open", () => resolve(ws)));
}

const server = app.listen(3003, () => console.log("telephony-bridge :3003"));

server.on("upgrade", async (req, socket, head) => {
  if (req.url?.startsWith("/telephony/stream")) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

wss.on("connection", async (twilioWs) => {
  console.log("Twilio media stream connected");
  oaSocket = await connectOpenAIRealtime();

  twilioWs.on("message", (msg) => {
    // Parse Twilio media frames & forward PCM chunks to OpenAI if/when API exposes binary audio ingest.
    // For now, this is a scaffold; adapt framing as OpenAI Realtime audio binary protocol evolves.
    // You may need to transcode μ-law to 16k mono PCM here.
  });

  oaSocket.on("message", (data) => {
    // Receive audio frames from OpenAI and send back to Twilio as "media" messages.
    // Format: { event: "media", media: { payload: base64pcm } }
  });

  const closeAll = () => { try { twilioWs.close(); } catch {} try { oaSocket?.close(); } catch {} };
  twilioWs.on("close", closeAll);
  oaSocket.on("close", closeAll);
});
