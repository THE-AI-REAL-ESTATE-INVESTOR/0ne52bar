import { NextResponse } from 'next/server';
import { migrateExistingMemberIDs } from '../../actions';

export async function GET(request: Request) {
  // Check for a secret key to prevent unauthorized access
  const { searchParams } = new URL(request.url);
  const secretKey = searchParams.get('secret');
  
  // Simple security check - in production, use a more secure approach
  if (secretKey !== 'one52-admin-secret') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Run the migration
    const result = await migrateExistingMemberIDs();
    
    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in migration API route:', error);
    return NextResponse.json(
      { success: false, message: 'Migration failed due to server error' },
      { status: 500 }
    );
  }
} 