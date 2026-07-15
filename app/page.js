"use client";

import { useMemo, useState } from "react";

const starterPrompts = [
  "A sales call analyzer starter for transcript summaries, objections, and follow-up actions.",
  "Create a production-ready workflow with risks, data flow, and owner handoffs.",
  "Generate a sample user journey and API contract for this starter.",
  "Give me a launch checklist and extension roadmap for this template."
];
const metrics = [
  "Server route",
  "Responsive UI",
  "Env setup"
];
const steps = [
  "Capture input",
  "Run server route",
  "Return structured output"
];
const chips = [
  "Insight console",
  "Next.js",
  "OpenAI",
  "Mobile ready"
];
const endpoint = "/api/run";

export default function Home() {
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const status = useMemo(() => {
    if (isRunning) return "Running";
    if (result?.demo) return "Local response";
    if (result) return "Completed";
    return "Ready";
  }, [isRunning, result]);

  async function submit(event) {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isRunning) return;

    setIsRunning(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Template run failed.");
      setResult(data);
    } catch (runError) {
      setError(runError.message);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08111f] text-white">
      <section className="mx-auto grid min-h-screen max-w-[1500px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="rounded-xl border bg-white/8 border-white/12 p-4"><div className="grid size-16 place-items-center rounded-xl text-xl font-black text-black" style={{ backgroundColor: "#67e8f9" }}>ASC</div><h1 className="mt-5 text-3xl font-black">AI Sales Call Analyzer</h1><p className="mt-3 text-sm leading-7 text-white/58">A sales call analyzer starter for transcript summaries, objections, and follow-up actions.</p><div className="mt-6 space-y-2">{chips.map((chip) => <span className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm" key={chip}>{chip}</span>)}</div></aside>
        <section className="rounded-xl border bg-white/8 border-white/12 flex min-h-[720px] flex-col"><div className="border-b border-white/10 p-4"><p className="text-xs font-black uppercase text-cyan-200">Analysis run</p><h2 className="mt-2 text-2xl font-black">Operator console</h2></div><div className="grid flex-1 gap-4 overflow-auto p-4 lg:grid-cols-[1fr_300px]"><div><form className="space-y-3" onSubmit={submit}>
              <textarea
                className="min-h-44 w-full resize-y border border-current/10 bg-white/70 px-4 py-3 text-sm leading-7 outline-none placeholder:opacity-40 focus:border-current/30"
                onChange={(event) => setPrompt(event.target.value)}
                value={prompt}
              />
              <button
                className="min-h-12 w-full px-5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 bg-cyan-200 text-slate-950 hover:bg-white"
                disabled={isRunning || !prompt.trim()}
                type="submit"
              >
                {isRunning ? "Running..." : "Analyze"}
              </button>
            </form><div className="mt-4">{error ? <div className="border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-100">{error}</div> : null}
            {result ? (
              <article className="border border-current/10 bg-white/60 p-4 text-sm leading-7 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>Result</strong>
                  <span className="border border-current/10 px-2 py-1 text-xs opacity-60">{result.model || "local"}</span>
                </div>
                <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap bg-black/5 p-4 text-sm leading-7">
                  {result.output || result.clientSecret || JSON.stringify(result, null, 2)}
                </pre>
              </article>
            ) : null}</div></div><div className="space-y-2">{starterPrompts.map((example) => (
                <button
                  key={example}
                  className="w-full border border-current/10 bg-white/45 px-3 py-3 text-left text-sm leading-6 opacity-80 transition hover:opacity-100"
                  onClick={() => setPrompt(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}</div></div></section>
      </section>
    </main>
  );
}
