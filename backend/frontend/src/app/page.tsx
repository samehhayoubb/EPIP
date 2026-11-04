"use client";

import { useEffect, useState } from "react";

type Health = { status: string; service: string; version: string };

const roadmap = [
  { name: "Project structure and Git", done: true },
  { name: "Backend health check", done: true },
  { name: "Projects and document upload API", done: false },
  { name: "Document search with citations (RAG)", done: false },
  { name: "BOQ import and normalization", done: false },
];

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/health")
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setError("Backend not reachable"));
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">EPIP</h1>
      <p className="mt-1 text-gray-500">
        Engineering Project Intelligence Platform
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Backend status</h2>
        {error && <p className="text-red-600">{error}</p>}
        {health && (
          <p className="text-green-600">
            {health.service} v{health.version}: {health.status}
          </p>
        )}
        {!health && !error && <p>Checking...</p>}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Roadmap</h2>
        <ul className="mt-2 space-y-1">
          {roadmap.map((item) => (
            <li key={item.name}>
              {item.done ? "✅" : "⬜"} {item.name}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}