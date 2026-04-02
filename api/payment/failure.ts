import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../_lib/payu';
import { parse } from 'querystring';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.redirect(302, '/programs?payment=failed');
  }

  let body: Record<string, string>;
  if (typeof req.body === 'string') {
    body = parse(req.body) as Record<string, string>;
  } else {
    body = req.body as Record<string, string>;
  }

  const { txnid, mihpayid } = body;

  if (txnid) {
    const admin = getSupabaseAdmin();
    await admin
      .from('payments')
      .update({
        status: 'failed',
        payu_mihpayid: mihpayid || null,
        payu_response: body,
      })
      .eq('txnid', txnid);
  }

  return res.redirect(302, '/programs?payment=failed');
}
