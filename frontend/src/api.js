const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Contact Form ──────────────────────────────────────────
export const sendContact = async (formData) => {
  const res = await fetch(`${BASE}/api/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
};

// ── Meeting Booking ───────────────────────────────────────
export const bookMeeting = async (meetingData) => {
  const res = await fetch(`${BASE}/api/meetings/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meetingData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
};

export const getAvailableSlots = async (date) => {
  const res = await fetch(`${BASE}/api/meetings/slots/?date=${date}`);
  return res.json();
};

// ── Blog ──────────────────────────────────────────────────
export const getBlogPosts = async (tag = '') => {
  const url = tag
    ? `${BASE}/api/blog/?tag=${encodeURIComponent(tag)}`
   : `${BASE}/api/blog/`;
  const res = await fetch(url);
  return res.json();
};

export const getBlogPost = async (slug) => {
  const res = await fetch(`${BASE}/api/blog/${slug}/`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
};