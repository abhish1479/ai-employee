import { Connection, Client } from "@temporalio/client";

let client: Client | null = null;

export async function getTemporalClient() {
  if (client) return client;
  const connection = await Connection.connect({ address: process.env.TEMPORAL_ADDRESS || "temporal:7233" });
  client = new Client({ connection, namespace: process.env.TEMPORAL_NAMESPACE || "default" });
  return client;
}
