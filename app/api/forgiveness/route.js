import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'forgiveness.json');

export async function GET() {
  try {
    let data = [];
    try {
      const content = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(content);
    } catch (e) {
      // File doesn't exist yet
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
