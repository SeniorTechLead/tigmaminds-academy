import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, callbackRequestNotificationEmail } from '../../../../src/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';
const supabase = createClient(supabaseUrl, serviceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, preferredTime, context, callerLabel } = body;

    if (!name || !phone || !preferredTime) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    // 1. Insert into Supabase contact_submissions table
    const subject = `Callback Request${context ? ` — ${context}` : ''}`;
    const message = `Preferred time: ${preferredTime}${context ? `\nContext: ${context}` : ''}`;

    const { data: inserted, error: dbErr } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: String(name).trim(),
          email: '',
          phone: String(phone).trim(),
          subject,
          message,
        },
      ])
      .select('id')
      .single();

    if (dbErr) {
      console.error('[Callback] Database insert error:', dbErr.message);
      return NextResponse.json(
        { error: 'Failed to record callback request. Please try again.' },
        { status: 500 },
      );
    }

    // 2. Send notification email to hackathon@tigmaminds.com
    const emailResult = await sendEmail(
      callbackRequestNotificationEmail(
        {
          name: String(name).trim(),
          phone: String(phone).trim(),
          preferredTime: String(preferredTime).trim(),
          context: context ? String(context).trim() : null,
          callerLabel: callerLabel ? String(callerLabel).trim() : null,
          submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        },
        'hackathon@tigmaminds.com',
      ),
    );

    if (!emailResult.success) {
      console.error('[Callback] Email dispatch error:', emailResult.error);
      return NextResponse.json({
        success: true,
        id: inserted?.id,
        emailSent: false,
        warning: 'Callback saved but notification email failed to send',
      });
    }

    return NextResponse.json({
      success: true,
      id: inserted?.id,
      emailSent: true,
    });
  } catch (err: any) {
    console.error('[Callback] Unexpected route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error.' },
      { status: 500 },
    );
  }
}

