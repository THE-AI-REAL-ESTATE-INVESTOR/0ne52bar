import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        EventTag: true,
        EventAttendee: true
      },
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST new event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
        time: body.time,
        image: body.image,
        facebookEventUrl: body.facebookEventUrl,
        eventTagId: body.eventTagId,
      },
      include: {
        EventTag: true,
        EventAttendee: true
      }
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}