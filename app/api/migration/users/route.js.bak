import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { source, target } = body;

    // Validate input
    if (!source || !target) {
      return NextResponse.json(
        { error: 'Source and target are required' },
        { status: 400 }
      );
    }

    // TODO: Implement user data migration logic
    // 1. Fetch user data from source
    // 2. Transform data if needed
    // 3. Save to target
    // 4. Update migration status

    return NextResponse.json({ 
      status: 'Migration started',
      source,
      target
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 