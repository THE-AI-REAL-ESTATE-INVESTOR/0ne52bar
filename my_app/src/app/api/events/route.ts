import { NextResponse } from 'next/server';
import { getEvents, addEvent } from '@/actions/event-actions';
import { AppError } from '@/lib/utils/error-handler';

// GET all events
export async function GET() {
  try {
    const result = await getEvents();
    if (!('success' in result)) {
      // Handle AppError
      const error = result as AppError;
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'NOT_FOUND' ? 404 : 500 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Unexpected error fetching events:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching events' },
      { status: 500 }
    );
  }
}

// POST new event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await addEvent({
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      time: body.time,
      image: body.image,
      facebookEventUrl: body.facebookEventUrl,
      eventTagId: body.eventTagId,
      isActive: body.isActive,
      isPublic: body.isPublic,
      showPastDate: body.showPastDate
    });
    
    if (!('success' in result)) {
      // Handle AppError
      const error = result as AppError;
      console.error('Error creating event:', error);
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'VALIDATION_ERROR' ? 400 : 500 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Unexpected error creating event:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating the event' },
      { status: 500 }
    );
  }
}