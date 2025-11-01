import React, { useState } from "react";
import { uploadAudio } from "../api";

export default function UploadForm({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select an audio or video file first!");
    setStatus("Uploading and analyzing...");
    const result = await uploadAudio(file);
    setStatus("✅ Upload complete! Refreshing dashboard...");
    onUploadComplete();
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col items-center">
      <h2 className="font-semibold mb-2">Upload Meeting File</h2>
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Upload & Analyze
      </button>
      <p className="text-sm mt-2 text-gray-600">{status}</p>
    </div>
  );
}
