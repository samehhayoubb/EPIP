"use client";   // renders on client side, not server side

import { useEffect, useState } from "react"; // React hooks for state and side effects

type Health = { status: string; service: string; version: string }; // Type definition for the health check response

const roadmap = [
  { name: "Project structure and Git", done: true },
  { name: "Backend health check", done: true },
  { name: "Projects and document upload API", done: false },
  { name: "Document search with citations (RAG)", done: false },
  { name: "BOQ import and normalization", done: false },
];

export default function Home() {                                   // React component for the home page, its a function that returns JSX (Html like syntax).
  const [health, setHealth] = useState<Health | null>(null);    //State is the data that rerenders page when it changes. useState is a React hook that returns a stateful value and a function to update it. Here, health is the stateful value and setHealth is the function to update it. The initial value of health is null.
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/health")          //Function that returns a PROMISE that resolves to the response of the request to the specified URL.
      .then((res) => res.json())                       // .then is when the return is successful. => res.json() parses the response body as JSON.
      .then(setHealth)                                 // .then is when the return is successful. setHealth sets the health state to the parsed JSON response.
      .catch(() => setError("Backend not reachable")); // .catch is when the return is unsuccessful. setError sets the error state to "Backend not reachable".
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