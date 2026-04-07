import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchWhatsAppTemplates } from '@/lib/whatsapp';

/**
 * GET /api/templates
 * Fetches all approved WhatsApp templates from Meta's API for the current user.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get current authenticated user (if called from browser)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const activeUserId = user?.id || userId;

    if (!activeUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: config } = await supabase
      .from('whatsapp_configs')
      .select('waba_id, access_token')
      .eq('user_id', activeUserId)
      .single();

    if (!config?.waba_id || !config?.access_token) {
      return NextResponse.json(
        { error: 'WhatsApp config not found' },
        { status: 400 }
      );
    }

    const templates = await fetchWhatsAppTemplates({
      wabaId: config.waba_id,
      accessToken: config.access_token,
    });

    return NextResponse.json({ templates });
  } catch (err: any) {
    console.error('Fetch templates error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
