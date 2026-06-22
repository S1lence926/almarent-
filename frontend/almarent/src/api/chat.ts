const API = import.meta.env.VITE_API_URL;

export const startChat = async (listingId: string, token: string) => {
  const res = await fetch(`${API}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ listing_id: listingId }),
  });
  if (!res.ok) throw new Error('Failed to start chat');
  return res.json();
};

export const getMyChats = async (token: string) => {
  const res = await fetch(`${API}/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const getMessages = async (chatId: string, token: string) => {
  const res = await fetch(`${API}/chats/${chatId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const sendMessage = async (chatId: string, content: string, token: string) => {
  const res = await fetch(`${API}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
};