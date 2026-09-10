import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, enrollmentRequestNotificationEmail } from '../../../../src/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';
const supabase = createClient(supabaseUrl, serviceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      guardianName,
      guardianEmail,
      guardianPhone,
      studentName,
      studentEmail,
      message,
    } = body;

    if (!guardianName || !guardianEmail || !studentName || !studentEmail) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    // 1. Insert into Supabase enrollment_requests table
    const { data: inserted, error: dbErr } = await supabase
      .from('enrollment_requests')
      .insert({
        guardian_name: String(guardianName).trim(),
        guardian_email: String(guardianEmail).trim().toLowerCase(),
        guardian_phone: guardianPhone ? String(guardianPhone).trim() : null,
        student_name: String(studentName).trim(),
        student_email: String(studentEmail).trim().toLowerCase(),
        message: message ? String(message).trim() : null,
      })
      .select('id')
      .single();

    if (dbErr) {
      console.error('[Enrollment] Database insert error:', dbErr.message);
      return NextResponse.json(
        { error: 'Failed to save enrollment request. Please try again.' },
        { status: 500 },
      );
    }

    // 2. Send notification email to hackathon@tigmaminds.com
    const emailResult = await sendEmail(
      enrollmentRequestNotificationEmail(
        {
          guardianName: String(guardianName).trim(),
          guardianEmail: String(guardianEmail).trim().toLowerCase(),
          guardianPhone: guardianPhone ? String(guardianPhone).trim() : null,
          studentName: String(studentName).trim(),
          studentEmail: String(studentEmail).trim().toLowerCase(),
          message: message ? String(message).trim() : null,
          submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        },
        'hackathon@tigmaminds.com',
      ),
    );

    if (!emailResult.success) {
      console.error('[Enrollment] Email dispatch error:', emailResult.error);
      return NextResponse.json({
        success: true,
        id: inserted?.id,
        emailSent: false,
        warning: 'Enrollment saved but notification email failed to send',
      });
    }

    return NextResponse.json({
      success: true,
      id: inserted?.id,
      emailSent: true,
    });
  } catch (err: any) {
    console.error('[Enrollment] Unexpected route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error.' },
      { status: 500 },
    );
  }
}

