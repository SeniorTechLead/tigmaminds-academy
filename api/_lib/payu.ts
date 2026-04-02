import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ── Plan pricing ──
export const PLANS = {
  online_monthly:    { INR: 1999,  USD: 24,  label: 'Online Monthly',    months: 1 },
  online_yearly:     { INR: 19999, USD: 239, label: 'Online Yearly',     months: 12 },
  in_person_monthly: { INR: 9999,  USD: 59,  label: 'In-Person Monthly', months: 1 },
} as const;

export type PlanId = keyof typeof PLANS;
export type Currency = 'INR' | 'USD';

export function isValidPlan(plan: string): plan is PlanId {
  return plan in PLANS;
}

// ── Transaction ID ──
export function generateTxnId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `TMA_${ts}_${rand}`;
}

// ── PayU Hash Generation ──
// Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
export function generateHash(params: {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  salt: string;
}): string {
  const { key, txnid, amount, productinfo, firstname, email, salt } = params;
  const udf1 = params.udf1 || '';
  const udf2 = params.udf2 || '';
  const udf3 = params.udf3 || '';
  const udf4 = params.udf4 || '';
  const udf5 = params.udf5 || '';

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return createHash('sha512').update(hashString).digest('hex');
}

// ── PayU Reverse Hash Verification ──
// Formula: sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
export function verifyHash(params: {
  key: string;
  salt: string;
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  receivedHash: string;
}): boolean {
  const { key, salt, status, txnid, amount, productinfo, firstname, email, receivedHash } = params;
  const udf1 = params.udf1 || '';
  const udf2 = params.udf2 || '';
  const udf3 = params.udf3 || '';
  const udf4 = params.udf4 || '';
  const udf5 = params.udf5 || '';

  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const computed = createHash('sha512').update(hashString).digest('hex');
  return computed === receivedHash;
}

// ── Period end calculation ──
export function calculatePeriodEnd(months: number): string {
  const end = new Date();
  end.setMonth(end.getMonth() + months);
  return end.toISOString();
}

// ── Supabase admin client (service role) ──
export function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}
