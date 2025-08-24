"use client";
import { useState } from "react";

export default function Talk() {
  const [id, setId] = useState("");
  const [json, setJson] = useState<any>(null);

  const fetchSummary = async () => {
    const r = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/api/talk/${id}`);
    setJson(await r.json());
  };

  return (
    <div style={{padding:20}}>
      <h2>Talk to Agent (Manager Summary)</h2>
      <input value={id} onChange={e=>setId(e.target.value)} placeholder="workflowId (e.g., lead-123)" />
      <button onClick={fetchSummary}>Fetch</button>
      <pre>{json ? JSON.stringify(json, null, 2) : "..."}</pre>
    </div>
  );
}
