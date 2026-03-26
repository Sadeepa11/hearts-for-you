import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = join(__dirname, 'forgiveness.json');

// Initialize data file if it doesn't exist
const initFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]');
  }
};
initFile();

app.post('/api/forgive', async (req, res) => {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(content);
    data.push({ 
      timestamp: new Date().toISOString(),
      message: "She forgave you! ❤️",
      ...req.body 
    });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/api/forgiveness', async (req, res) => {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    res.json(JSON.parse(content));
  } catch (error) {
    res.json([]);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n\x1b[32m[Server]\x1b[0m Backend running on http://localhost:${PORT}`);
});
