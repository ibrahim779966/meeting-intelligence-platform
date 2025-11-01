import React, { useEffect, useState } from "react";
import { getMeetings, getMeetingById } from "../api";
import UploadForm from "./UploadForm";
import MeetingList from "./MeetingList";
import SummaryCard from "./SummaryCard";
import ActionFeed from "./ActionFeed";
import KnowledgeGraph from "./KnowledgeGraph";
import AnalyticsDashboard from "./AnalyticsDashboard";
import SearchBox from "./SearchBox";
import SearchResults from "./SearchResults";

export default function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleSelectFromSearch = async (meetingId) => {
    const meeting = await getMeetingById(meetingId);
    setSelectedMeeting(meeting);
    setSearchResults(null);
  };

  const loadMeetings = async () => {
    try {
      setIsLoading(true);
      const data = await getMeetings();
      console.log("Meetings loaded:", data);
      setMeetings(data);
    } catch (err) {
      console.error("Failed to load meetings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async (meeting) => {
    try {
      const full = await getMeetingById(meeting.id);
      console.log("Full meeting data:", full);
      setSelectedMeeting(full);
      setShareUrl(""); // Reset share URL when selecting new meeting
    } catch (error) {
      console.error("Error loading meeting:", error);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      // await deleteMeeting(meetingId);
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
      if (selectedMeeting && selectedMeeting.id === meetingId) {
        setSelectedMeeting(null);
        setShareUrl(""); // Reset share URL when deleting current meeting
      }
      console.log("Meeting deleted:", meetingId);
    } catch (error) {
      console.error("Failed to delete meeting:", error);
    }
  };

  // Share meeting summary functionality
  const handleShareMeeting = async () => {
    if (!selectedMeeting) return;
    
    setIsSharing(true);
    try {
      // This would call your backend to generate a shareable link
      // const response = await shareMeeting(selectedMeeting.id);
      // const shareableUrl = response.shareUrl;
      
      // For demo - generate a mock shareable URL
      const mockShareUrl = `${window.location.origin}/share/${selectedMeeting.id}`;
      setShareUrl(mockShareUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(mockShareUrl);
      alert("Shareable link copied to clipboard!");
      
    } catch (error) {
      console.error("Failed to share meeting:", error);
      alert("Failed to generate shareable link");
    } finally {
      setIsSharing(false);
    }
  };

  // Generate export content
  const generateExportContent = () => {
    if (!selectedMeeting) return "";
    
    return `
MEETING SUMMARY - ${selectedMeeting.filename}

SUMMARY:
${selectedMeeting.summary || "No summary available"}

ACTION ITEMS:
${selectedMeeting.actionItems ? selectedMeeting.actionItems.map(item => `• ${item}`).join('\n') : "No action items"}

KEY TOPICS:
${selectedMeeting.topics ? selectedMeeting.topics.map(topic => `• ${topic}`).join('\n') : "No topics"}

SENTIMENT: ${selectedMeeting.sentiment || "Not analyzed"}

Generated on ${new Date().toLocaleDateString()}
    `.trim();
  };

  // Export as text file
  const handleExportText = () => {
    if (!selectedMeeting) return;
    
    const content = generateExportContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMeeting.filename}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Meeting Analytics</h1>
        <p className="text-blue-600">Analyze and search through your meeting recordings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
            <UploadForm onUploadComplete={loadMeetings} />
          </div>
          
          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
            <SearchBox onSearchResults={handleSearchResults} />
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-blue-800">Search Results</h2>
                <button 
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear Search
                </button>
              </div>
              <SearchResults 
                results={searchResults} 
                onSelectMeeting={handleSelectFromSearch} 
              />
            </div>
          )}

          {/* Meeting History */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-blue-800">Meeting History</h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                {meetings.length} meetings
              </span>
            </div>
            {isLoading ? (
              <p className="text-blue-500 text-center py-4">Loading meetings...</p>
            ) : meetings.length === 0 ? (
              <p className="text-blue-500 text-center py-4">No meetings found. Upload a meeting to get started.</p>
            ) : (
              <MeetingList 
                meetings={meetings} 
                onSelect={handleSelect}
                onDelete={handleDeleteMeeting}
              />
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Shareable Header */}
          {selectedMeeting && (
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-blue-800">{selectedMeeting.filename}</h2>
                  <p className="text-blue-600">Share this meeting summary with others</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleExportText}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📄 Export Text
                  </button>
                  <button
                    onClick={handleShareMeeting}
                    disabled={isSharing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSharing ? "Sharing..." : "🔗 Share Meeting"}
                  </button>
                </div>
              </div>
              
              {/* Share URL Display */}
              {shareUrl && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 font-medium mb-2">Shareable Link (copied to clipboard):</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 border border-blue-300 rounded px-3 py-2 text-blue-600 bg-white"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
            <SummaryCard meeting={selectedMeeting} />
          </div>

          {/* Action Items and Knowledge Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
              <ActionFeed meeting={selectedMeeting} />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
              <KnowledgeGraph meeting={selectedMeeting} />
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
            <AnalyticsDashboard meetings={meetings} />
          </div>
        </div>
      </div>
    </div>
  );
}