import { NextResponse } from 'next/server';

// Pi Developer Portal validation key - LIVE and VERIFIED
// Domain: https://nusantaraneoinft2019.pinet.com
const VALIDATION_KEY = '2b04b0fb58b7b8eefa7c8fee41494147c0b5b627a4ae13f7131e1a398eafb2a3e6ce2e7ec8bbc586297b00dc6f2bcc3d63f5630b3e071b2f77d9db6b4387b1a4';

export const dynamic = 'force-dynamic'; // Force fresh response every time - NO caching

export async function GET() {
  console.log('[v0] Domain validation key requested');
  
  return new NextResponse(VALIDATION_KEY, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    },
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Content-Length': VALIDATION_KEY.length.toString(),
    },
  });
}
