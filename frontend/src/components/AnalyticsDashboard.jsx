import React from "react";

export default function AnalyticsDashboard({ meetings }) {
  if (!meetings || meetings.length === 0) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="font-semibold mb-3">📊 Analytics</h2>
        <p className="text-gray-500">No meetings to analyze yet.</p>
      </div>
    );
  }

  // Calculate analytics
  const sentimentCount = { positive: 0, neutral: 0, negative: 0 };
  const topicFrequency = {};
  const totalDuration = meetings.length; // Simplified - using meeting count

  meetings.forEach(meeting => {
    // Sentiment trends
    const sentiment = meeting.sentiment?.toLowerCase() || 'neutral';
    if (sentimentCount[sentiment] !== undefined) {
      sentimentCount[sentiment]++;
    }

    // Topic frequency
    const topics = meeting.topics || [];
    topics.forEach(topic => {
      const topicName = typeof topic === 'object' ? (topic.text || topic.topic || topic) : topic;
      topicFrequency[topicName] = (topicFrequency[topicName] || 0) + 1;
    });
  });

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="font-semibold mb-3">📊 Analytics</h2>
      
      {/* Sentiment Trends */}
      <div className="mb-4">
        <h3 className="font-medium text-sm text-gray-700 mb-2">Sentiment Trends</h3>
        <div className="space-y-2">
          {Object.entries(sentimentCount).map(([sentiment, count]) => (
            <div key={sentiment} className="flex items-center">
              <div className="w-20 text-sm capitalize">{sentiment}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    sentiment === 'positive' ? 'bg-green-500' :
                    sentiment === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(count / meetings.length) * 100}%` }}
                ></div>
              </div>
              <div className="w-8 text-sm text-right">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Frequency */}
      <div className="mb-4">
        <h3 className="font-medium text-sm text-gray-700 mb-2">Top Topics</h3>
        <div className="space-y-1">
          {Object.entries(topicFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([topic, count]) => (
              <div key={topic} className="flex justify-between text-sm">
                <span className="truncate flex-1">{topic}</span>
                <span className="text-gray-600 ml-2">{count}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Meeting Stats */}
   {/* Meeting Stats */}
<div>
  <h3 className="font-medium text-sm text-gray-700 mb-2">Meeting Stats</h3>
  <div className="grid grid-cols-3 gap-2 text-sm">
    <div className="text-center p-2 bg-blue-50 rounded">
      <div className="font-bold">{meetings.length}</div>
      <div className="text-gray-600">Total Meetings</div>
    </div>
    <div className="text-center p-2 bg-green-50 rounded">
      <div className="font-bold">{Object.keys(topicFrequency).length}</div>
      <div className="text-gray-600">Unique Topics</div>
    </div>
    <div className="text-center p-2 bg-purple-50 rounded">
      <div className="font-bold">
        {(() => {
          const totalWords = meetings.reduce((sum, meeting) => 
            sum + (meeting.transcript?.split(' ').length || 0), 0
          );
          const avgWords = Math.round(totalWords / meetings.length) || 0;
          // Estimate: ~130 words per minute for speech
          const avgMinutes = Math.round(avgWords / 130);
          return avgMinutes > 0 ? `${avgMinutes}m` : 'N/A';
        })()}
      </div>
      <div className="text-gray-600">Avg Duration</div>
    </div>
  </div>
</div>
    </div>
  );
}