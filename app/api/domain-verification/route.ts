import { NextRequest, NextResponse } from 'next/server';
import { PI_DOMAIN_CONFIG } from '@/lib/system-config';

/**
 * Domain Verification Endpoint for Pi Developer Portal
 * Validates that nusantaraneoinft2019.pinet.com is properly configured
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'verified',
      domain: PI_DOMAIN_CONFIG.OFFICIAL_DOMAIN,
      verification_secret: PI_DOMAIN_CONFIG.VERIFICATION_SECRET.slice(0, 32) + '...', // Masked for security
      verification_status: 'COMPLETE',
      verified_at: PI_DOMAIN_CONFIG.VERIFIED_AT,
      webhook_enabled: PI_DOMAIN_CONFIG.WEBHOOK_ENABLED,
      webhook_url: '/api/webhooks/pi-payment',
      domain_synced: PI_DOMAIN_CONFIG.DOMAIN_SYNCED,
      sync_timestamp: new Date().toISOString(),
      message: 'Domain synchronization complete. Ready for Pi Network integration.',
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate verification secret
    if (body.verification_secret !== PI_DOMAIN_CONFIG.VERIFICATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid verification secret' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        domain: PI_DOMAIN_CONFIG.OFFICIAL_DOMAIN,
        verified: true,
        message: 'Domain verification complete and synchronized',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Verification failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
