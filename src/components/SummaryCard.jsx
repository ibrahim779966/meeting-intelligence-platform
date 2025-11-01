import React from "react";

export default function SummaryCard({ meeting }) {
  if (!meeting) return <p>Select a meeting to view details.</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-2">🧾 Summary</h2>
      <p className="text-gray-800 mb-4">{meeting.summary}</p>

      <h3 className="font-semibold mt-3">✅ Action Items</h3>
      <ul className="list-disc list-inside text-gray-700">
        {meeting.action_items?.map((a, i) => (
          <li key={i}>{a.text || a.task || a.action || a.description || String(a)}</li>
        ))}
      </ul>

      <p className="mt-4">
        <strong>🫶 Sentiment:</strong>{" "}
        <span
          className={
            meeting.sentiment === "positive"
              ? "text-green-600"
              : meeting.sentiment === "negative"
              ? "text-red-600"
              : "text-gray-600"
          }
        >
          {meeting.sentiment}
        </span>
      </p>
    </div>
  );
}
