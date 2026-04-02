/**
 * Detect user's currency based on timezone.
 * Asia/Kolkata or Asia/Calcutta → INR, else USD.
 */
export function useCurrency() {
  const isIndia = (() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta');
    } catch {
      return false;
    }
  })();

  return {
    currency: isIndia ? 'INR' as const : 'USD' as const,
    isIndia,
    symbol: isIndia ? '₹' : '$',
  };
}
