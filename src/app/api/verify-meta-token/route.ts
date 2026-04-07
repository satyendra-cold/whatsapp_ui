import { NextRequest, NextResponse } from 'next/server';
import { verifyMetaToken } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, phoneNumberId } = await request.json();

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json(
        { valid: false, error: 'Missing accessToken or phoneNumberId' },
        { status: 400 }
      );
    }

    const result = await verifyMetaToken(accessToken, phoneNumberId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: err.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
