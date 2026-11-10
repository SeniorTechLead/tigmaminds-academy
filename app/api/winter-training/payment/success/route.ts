import { NextRequest, NextResponse } from 'next/server';
import { verifyHash } from '../../../../../src/lib/payu';
import { recordPaymentSuccess } from '../../../../../src/lib/winter-db';
import { sendEmail, winterTrainingEnrollmentConfirmationEmail } from '../../../../../src/lib/email';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    const {
      mihpayid,
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      bank_ref_num,
      mode,
    } = body;

    const origin =
      req.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    const merchantKey = process.env.PAYU_MERCHANT_KEY || 'lGWab3';
    const merchantSalt = process.env.PAYU_MERCHANT_SALT || 'aq1BPSnGpbtTMV8FmIdDznx0HQt9LtKJ';

    // Verify reverse hash
    let isValid = true;
    if (merchantKey && merchantSalt && hash) {
      isValid = verifyHash({
        key: merchantKey,
        salt: merchantSalt,
        status,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
        receivedHash: hash,
      });
    }

    if (!isValid) {
      console.error('[WinterTraining] PayU hash verification failed for txnid:', txnid);
      const failUrl = new URL('/programs/winter-training', origin);
      failUrl.searchParams.set('payment', 'failed');
      failUrl.searchParams.set('reason', 'Payment response verification failed.');
      return NextResponse.redirect(failUrl.toString(), 303);
    }

    // Update status in PostgreSQL registration_payments table
    if (txnid) {
      try {
        await recordPaymentSuccess({
          txnid,
          mihpayid,
          bankRefNum: bank_ref_num,
          paymentMode: mode,
          payuResponse: body,
        });
      } catch (dbErr) {
        console.error('[WinterTraining] Error updating PostgreSQL payment record:', dbErr);
      }
    }

    if (status === 'success') {
      // Send confirmation & receipt email asynchronously to the student
      if (email) {
        try {
          const fullName = `${firstname || ''} ${udf3 || ''}`.trim() || 'Student';
          const emailParams = winterTrainingEnrollmentConfirmationEmail({
            studentName: fullName,
            studentEmail: email.trim(),
            registrationId: udf1 || 'CONFIRMED',
            txnid: txnid || '',
            mihpayid: mihpayid || txnid || '',
            amount: amount || '499.00',
            institution: udf2 || '',
          });
          sendEmail(emailParams).catch((mailErr) => {
            console.warn('[WinterTraining] Email sending notice (check email provider credentials in .env.local):', mailErr);
          });
        } catch (mailBuildErr) {
          console.warn('[WinterTraining] Email build warning:', mailBuildErr);
        }
      }

      const successUrl = new URL('/programs/winter-training', origin);
      successUrl.searchParams.set('payment', 'success');
      successUrl.searchParams.set('txnid', txnid || '');
      successUrl.searchParams.set('regId', udf1 || '');
      successUrl.searchParams.set('amount', amount || '499.00');
      successUrl.searchParams.set('name', `${firstname || ''} ${udf3 || ''}`.trim());
      successUrl.searchParams.set('email', email || '');
      successUrl.searchParams.set('mihpayid', mihpayid || txnid || '');
      // Do not append hash so the page opens directly at top where the confirmation receipt is mounted
      return NextResponse.redirect(successUrl.toString(), 303);
    }

    const failedUrl = new URL('/programs/winter-training', origin);
    failedUrl.searchParams.set('payment', 'failed');
    failedUrl.searchParams.set('reason', body.error_Message || 'Payment was not successful.');
    failedUrl.hash = 'register';
    return NextResponse.redirect(failedUrl.toString(), 303);
  } catch (err: unknown) {
    console.error('[WinterTraining] PayU success handler error:', err);
    const origin =
      req.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';
    const fallbackUrl = new URL('/programs/winter-training', origin);
    fallbackUrl.searchParams.set('payment', 'failed');
    fallbackUrl.searchParams.set(
      'reason',
      'An unexpected error occurred while processing payment confirmation.'
    );
    return NextResponse.redirect(fallbackUrl.toString(), 303);
  }
}
