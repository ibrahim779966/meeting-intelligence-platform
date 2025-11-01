import React from "react";

export default function MeetingList({ meetings, onSelect, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="font-semibold mb-3">📜 Meeting History</h2>
      {!Array.isArray(meetings) || meetings.length === 0 ? (
        <p className="text-gray-500">No meetings yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {meetings.map((m) => (
            <li
              key={m.id}
              className="p-2 hover:bg-gray-100 cursor-pointer group flex justify-between items-center"
            >
              <div 
                className="flex-1"
                onClick={() => onSelect(m)}
              >
                <div className="font-medium">{m.filename}</div>
                <div className="text-sm text-gray-500">
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
              
              {/* Delete button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onSelect
                  if (window.confirm(`Are you sure you want to delete "${m.filename}"?`)) {
                    onDelete(m.id);
                  }
                }}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                title="Delete meeting"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}