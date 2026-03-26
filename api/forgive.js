import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const event = {
      timestamp: new Date().toISOString(),
      message: "Semi Forgave You! ❤️",
      ...data
    };

    // Try to use Vercel KV if available, else use a temporary in-memory store (for demo)
    if (process.env.KV_REST_API_URL) {
      await kv.lpush('forgiveness_events', event);
    } else {
      console.warn("Vercel KV not configured. Data will not persist.");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save data' });
  }
}
