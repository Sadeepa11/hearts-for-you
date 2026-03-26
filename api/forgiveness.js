import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to use Vercel KV, else return empty array (for demo)
    if (process.env.KV_REST_API_URL) {
      const data = await kv.lrange('forgiveness_events', 0, -1);
      res.status(200).json(data || []);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
