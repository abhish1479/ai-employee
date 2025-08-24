export default function Home() {
  return (
    <main style={{padding:20}}>
      <h1>AI Employee Console</h1>
      <ul>
        <li><a href="/mic">🎙️ Mic Test (OpenAI Realtime)</a></li>
        <li><a href="/talk">🗣️ Talk-to-me (manager view)</a></li>
      </ul>
    </main>
  );
}
