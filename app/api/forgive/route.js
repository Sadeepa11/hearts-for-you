import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'forgiveness.json');

export async function POST(req) {
  try {
    const { message } = await req.json();
    
    let data = [];
    try {
      const content = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(content);
    } catch (e) {
      // File doesn't exist yet, start with empty array
    }

    const newRecord = {
      timestamp: new Date().toISOString(),
      message: message || "She forgave you! ❤️"
    };

    data.push(newRecord);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to save forgiveness' }, { status: 500 });
  }
}
