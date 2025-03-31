import { NextRequest, NextResponse } from 'next/server';
import { memberService } from '@/lib/db/member';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const memberId = url.pathname.split('/').pop();

  if (!memberId) {
    return NextResponse.json({ message: 'Member ID is required' }, { status: 400 });
  }

  try {
    const member = await memberService.find({ memberId });

    if (member) {
      return NextResponse.json(member, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}