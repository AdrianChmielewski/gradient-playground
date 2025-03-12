import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'presets.json');

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const presets = JSON.parse(data);
    return NextResponse.json(presets);
  } catch (error) {
    return NextResponse.json({ error: "Could not read presets." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const preset = await request.json();
    let presets = [];
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      presets = JSON.parse(data);
    } catch (error) {
      presets = [];
    }
    presets.push(preset);
    fs.writeFileSync(filePath, JSON.stringify(presets, null, 2));
    return NextResponse.json({ message: "Preset saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save preset" }, { status: 500 });
  }
}
