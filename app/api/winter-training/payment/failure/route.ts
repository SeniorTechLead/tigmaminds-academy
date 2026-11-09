import { NextRequest, NextResponse } from 'next/server';
import { recordPaymentFailure } from '../../../../../src/lib/winter-db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    const { txnid, mihpayid, error_Message, status } = body;

    const origin =
      req.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    if (txnid) {
      try {
        await recordPaymentFailure({
          txnid,
          mihpayid,
          errorMessage: error_Message || status || 'Transaction failed',
          payuResponse: body,
        });
      } catch (dbErr) {
        console.error('[WinterTraining] Error logging failure in PostgreSQL:', dbErr);
      }
    }

    const failedUrl = new URL('/programs/winter-training', origin);
    failedUrl.searchParams.set('payment', 'failed');
    if (txnid) failedUrl.searchParams.set('txnid', txnid);
    failedUrl.searchParams.set(
      'reason',
      error_Message ||
        (status === 'userCancelled'
          ? 'Transaction was cancelled by user.'
          : 'Payment failed or was declined.')
    );
    failedUrl.hash = 'register';

    return NextResponse.redirect(failedUrl.toString(), 303);
  } catch (err: unknown) {
    console.error('[WinterTraining] PayU failure handler error:', err);
    const origin =
      req.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';
    const fallbackUrl = new URL('/programs/winter-training', origin);
    fallbackUrl.searchParams.set('payment', 'failed');
    fallbackUrl.searchParams.set('reason', 'Payment was cancelled or failed.');
    fallbackUrl.hash = 'register';
    return NextResponse.redirect(fallbackUrl.toString(), 303);
  }
}
