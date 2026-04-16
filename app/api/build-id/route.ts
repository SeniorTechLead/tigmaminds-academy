import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let buildId: string | null = null;

function getBuildId() {
  if (buildId) return buildId;
  try {
    buildId = fs.readFileSync(path.join(process.cwd(), '.next', 'BUILD_ID'), 'utf8').trim();
  } catch {
    buildId = Date.now().toString();
  }
  return buildId;
}

export async function GET() {
  return NextResponse.json(
    { buildId: getBuildId() },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'CDN-Cache-Control': 'no-store',
      },
    },
  );
}
