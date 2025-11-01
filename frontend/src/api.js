// src/api.js
const BASE_URL = "http://localhost:8000";

export const searchMeetings = async (query) => {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`Search failed: ${res.statusText}`);
  }
  return await res.json();
};

export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/audio/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Upload failed: ${msg}`);
  }

  return await res.json();
};


export const getMeetings = async () => {
  const res = await fetch(`${BASE_URL}/meetings/list`);
  return await res.json();
};

export const getMeetingById = async (id) => {
  const res = await fetch(`${BASE_URL}/meetings/${id}`);
  return await res.json();
};
