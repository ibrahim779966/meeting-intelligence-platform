import React from "react";

export default function KnowledgeGraph({ meeting }) {
  if (!meeting) return (
    <div className="bg-white p-4 rounded-2xl shadow-md text-center">
      <h2 className="font-semibold mb-3">🧩 Knowledge Graph</h2>
      <p className="text-gray-500">Select a meeting to view topics.</p>
    </div>
  );

  const topics = meeting.topics?.map(topic => 
    typeof topic === 'object' ? (topic.text || topic.topic || topic) : topic
  ) || [];

  if (topics.length === 0) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="font-semibold mb-3">🧩 Knowledge Graph</h2>
        <p className="text-gray-500">No topics identified.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="font-semibold mb-3">🧩 Knowledge Graph</h2>
      
      {/* Topic Network Visualization */}
      <div className="relative min-h-[200px] border border-gray-200 rounded-lg p-4 bg-gray-50">
        {/* Connection Lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {topics.slice(1).map((_, index) => (
            <line
              key={index}
              x1="20%"
              y1={`${(index * 30) + 40}px`}
              x2="80%"
              y2={`${((index + 1) * 30) + 40}px`}
              stroke="#93C5FD"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Topic Nodes */}
        <div className="relative z-10">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-2 mx-auto text-center w-3/4"
              style={{ 
                marginTop: index === 0 ? '0' : '10px',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
              }}
            >
              {topic}
            </div>
          ))}
        </div>
      </div>

      {/* Topic Relationships */}
      <div className="mt-4">
        <h3 className="font-medium text-sm text-gray-700 mb-2">Topic Relationships:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          {topics.slice(1).map((topic, index) => (
            <div key={index}>
              <span className="font-medium">{topics[index]}</span> 
              <span className="mx-2">→</span>
              <span className="font-medium">{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}