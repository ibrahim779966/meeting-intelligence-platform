import React from "react";

export default function SearchResults({ results, onSelectMeeting }) {
  if (!results) return null;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="font-semibold mb-3">📄 Search Results</h2>
      {results.results && results.results.ids && results.results.ids[0].length > 0 ? (
        <div className="space-y-3">
          {results.results.ids[0].map((meetingId, index) => (
            <div
              key={meetingId}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectMeeting(meetingId)}
            >
              <div className="font-medium">
                {results.results.metadatas[0][index]?.filename || `Meeting ${meetingId}`}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {results.results.documents[0][index]?.substring(0, 150)}...
              </div>
              <div className="text-xs text-blue-600 mt-2">
                Score: {results.results.distances[0][index]?.toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
}