import React from "react";

export default function ActionFeed({ meeting }) {
  if (!meeting) return null;

  const actions = meeting.action_items || [];
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="font-semibold mb-3">⚡ Key Action Items</h2>
      {actions.length === 0 ? (
        <p className="text-gray-500">No action items detected.</p>
      ) : (
        <ul className="list-disc list-inside">
          {actions.map((a, i) => (
            <li key={i}>{a.text || a.task || a.action || a.description || String(a)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
