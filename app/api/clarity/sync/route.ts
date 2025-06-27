import { NextRequest, NextResponse } from 'next/server';
import { AppState } from '@/lib/types/clarity.types';

// ============================================================================
// SLUG STORE DATABASE SYNC ENDPOINT
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, state } = body as { key: string; state: AppState };

    // Validate the request
    if (!key || !state) {
      return NextResponse.json(
        { error: 'Missing key or state in request body' },
        { status: 400 }
      );
    }

    // Validate it's our Clarity app key
    if (key !== 'clarity-app') {
      return NextResponse.json(
        { error: 'Invalid application key' },
        { status: 400 }
      );
    }

    // TODO: In production, add authentication
    // const userId = await getUserIdFromToken(request);
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Save to your database (Supabase, PostgreSQL, etc.)
    // Example with hypothetical database:
    // await saveUserAppState(userId, key, state);
    
    // For now, we'll just log the sync operation
    console.log('📊 Clarity State Sync:', {
      key,
      projectsCount: state.projects.length,
      todosCount: state.todos.length,
      lastUpdated: state.analytics.lastUpdated,
      timestamp: new Date().toISOString(),
    });

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return success response expected by slug-store
    return NextResponse.json({
      success: true,
      synced: true,
      timestamp: new Date().toISOString(),
      message: 'Clarity state synchronized successfully',
    });

  } catch (error) {
    console.error('Sync endpoint error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to sync Clarity state' 
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for initial state loading
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key || key !== 'clarity-app') {
      return NextResponse.json(
        { error: 'Invalid or missing key parameter' },
        { status: 400 }
      );
    }

    // TODO: In production, add authentication and load user state
    // const userId = await getUserIdFromToken(request);
    // const savedState = await getUserAppState(userId, key);
    
    // For now, return empty state (client will use default)
    return NextResponse.json({
      success: true,
      state: null, // null means use client default
      message: 'No saved state found, using defaults',
    });

  } catch (error) {
    console.error('State load error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to load saved state' 
      },
      { status: 500 }
    );
  }
} 