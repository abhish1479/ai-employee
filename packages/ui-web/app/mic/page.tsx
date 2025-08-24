"use client";
import { useEffect, useRef, useState } from "react";

/** Connect browser mic to OpenAI Realtime via WebRTC */
export default function Mic() {
  const [connected, setConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function start() {
    // 1) Ask gateway to mint session (server-side uses OPENAI_API_KEY)
    const tok = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/api/realtime/token`, { method: "POST" })
      .then(r => r.json());

    // 2) Create RTCPeerConnection to OpenAI
    const pc = new RTCPeerConnection();
    const audioEl = audioRef.current!;
    pc.ontrack = (e) => { audioEl.srcObject = e.streams[0]; };

    const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
    pc.addTrack(ms.getTracks()[0], ms);

    const offer = await pc.createOffer({ offerToReceiveAudio: true });
    await pc.setLocalDescription(offer);

    const base64SdpOffer = btoa(offer.sdp || "");
    const resp = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tok.client_secret.value}`,
        "Content-Type": "application/sdp"
      },
      body: atob(base64SdpOffer) // raw SDP
    });

    const answer = { type: "answer", sdp: await resp.text() } as RTCSessionDescriptionInit;
    await pc.setRemoteDescription(answer);
    setConnected(true);
  }

  return (
    <div style={{padding:20}}>
      <h2>Realtime Mic Test</h2>
      <button onClick={start} disabled={connected}>{connected ? "Connected" : "Connect & Speak"}</button>
      <audio ref={audioRef} autoPlay />
      <p>Tip: say “Introduce yourself” and “What can you do?”</p>
    </div>
  );
}
