import pg from 'pg';

const { Pool } = pg;

// Singleton pool for winter_internship PostgreSQL database
let pool: pg.Pool | null = null;

export function getWinterDbPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.WINTER_DB_HOST || '3.109.211.22',
      port: parseInt(process.env.WINTER_DB_PORT || '5432', 10),
      user: process.env.WINTER_DB_USER || 'postgres',
      password: process.env.WINTER_DB_PASSWORD || 'GoodThings2021',
      database: process.env.WINTER_DB_NAME || 'winter_internship',
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('[WinterDb] Unexpected idle client error:', err);
    });
  }

  return pool;
}

export interface CreatePaymentParams {
  registrationId: string;
  txnid: string;
  amount: number;
  currency?: string;
  hash?: string;
}

/**
 * Record pending PayU payment transaction
 */
export async function createPendingPaymentRecord(params: CreatePaymentParams): Promise<string> {
  const db = getWinterDbPool();
  const query = `
    INSERT INTO registration_payments (registration_id, txnid, amount, currency, status, hash)
    VALUES ($1, $2, $3, $4, 'pending', $5)
    RETURNING id;
  `;
  const values = [
    params.registrationId,
    params.txnid,
    params.amount,
    params.currency || 'INR',
    params.hash || null,
  ];

  const res = await db.query(query, values);
  return res.rows[0].id;
}

export interface PaymentSuccessParams {
  txnid: string;
  mihpayid?: string;
  bankRefNum?: string;
  paymentMode?: string;
  payuResponse?: Record<string, unknown>;
}

/**
 * Update transaction to 'success' upon PayU confirmation
 */
export async function recordPaymentSuccess(params: PaymentSuccessParams): Promise<void> {
  const db = getWinterDbPool();
  const query = `
    UPDATE registration_payments
    SET status = 'success',
        mihpayid = $2,
        bank_ref_num = $3,
        payment_mode = $4,
        payu_response = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE txnid = $1;
  `;
  const values = [
    params.txnid,
    params.mihpayid || null,
    params.bankRefNum || null,
    params.paymentMode || null,
    params.payuResponse ? JSON.stringify(params.payuResponse) : null,
  ];

  await db.query(query, values);
}

export interface PaymentFailureParams {
  txnid: string;
  mihpayid?: string;
  errorMessage?: string;
  payuResponse?: Record<string, unknown>;
}

/**
 * Update transaction to 'failed' upon PayU decline/cancel
 */
export async function recordPaymentFailure(params: PaymentFailureParams): Promise<void> {
  const db = getWinterDbPool();
  const query = `
    UPDATE registration_payments
    SET status = 'failed',
        mihpayid = $2,
        error_message = $3,
        payu_response = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE txnid = $1;
  `;
  const values = [
    params.txnid,
    params.mihpayid || null,
    params.errorMessage || 'Payment was declined or cancelled.',
    params.payuResponse ? JSON.stringify(params.payuResponse) : null,
  ];

  await db.query(query, values);
}

