import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../src/lib/payu';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const body: Record<string, string> = {};
  formData.forEach((value, key) => { body[key] = value.toString(); });

  const { txnid, mihpayid } = body;

  if (txnid) {
    const admin = getSupabaseAdmin();
    await admin.from('payments').update({
      status: 'failed', payu_mihpayid: mihpayid || null, payu_response: body,
    }).eq('txnid', txnid);
  }

  return NextResponse.redirect(new URL('/programs?payment=failed', req.url));
}
