// Silent Backend Whitelist Verification for Nusantara Neo iNFT Forge
// 9 Pioneer Drivers with 0% Platform Fee - Backend Only (No UI Exposure)
// LOCKED CONFIGURATION - DO NOT MODIFY

const PIONEER_ADDRESSES = [
  "Ful21",
  "Murtini79",
  "SIREP74",
  "ifah24",
  "Muhammadefendi123",
  "Titin999",
  "afifmasfiqo",
  "Tar72",
  "Rid81",
] as const;

/**
 * Silent verification - backend only, never displayed in UI
 * Returns true if address is a verified pioneer driver
 */
export function isPioneerWhitelisted(address: string | null | undefined): boolean {
  if (!address) return false;
  const normalized = String(address).trim().toLowerCase();
  return PIONEER_ADDRESSES.some((a) => a.toLowerCase() === normalized);
}

/**
 * Get platform fee override for pioneer (0%)
 * Returns 0 if pioneer, null if not
 */
export function getPioneerFeeOverride(address: string | null | undefined): 0 | null {
  return isPioneerWhitelisted(address) ? 0 : null;
}

/**
 * Revenue split configuration locked for pioneers on all transaction types
 * Platform fee LOCKED at 0% for all pioneers
 */
export const PIONEER_REVENUE_SPLITS = {
  primary: {
    creator: 0.50,      // User gets 50%
    community: 0.25,    // ICP2E Jatim gets 25%
    dev: 0.10,          // Dev/Founder gets 10%
    server: 0.10,       // Server gets 10%
    gas: 0.05,          // Gas 5%
    platformFee: 0.00,  // LOCKED: 0% for pioneers
  },
  mint: {
    community: 0.35,    // ICP2E Jatim gets 35%
    server: 0.40,       // Server gets 40%
    dev: 0.15,          // Dev gets 15%
    gas: 0.10,          // Gas 10%
    platformFee: 0.00,  // LOCKED: 0% for pioneers
  },
  secondary: {
    creator: 0.50,      // Creator gets 50%
    community: 0.30,    // ICP2E Jatim gets 30%
    dev: 0.20,          // Dev gets 20%
    platformFee: 0.00,  // LOCKED: 0% for pioneers
  },
  rental: {
    lender: 0.50,       // Lender gets 50%
    community: 0.25,    // ICP2E Jatim gets 25%
    dev: 0.10,          // Dev gets 10%
    server: 0.10,       // Server gets 10%
    gas: 0.05,          // Gas 5%
    platformFee: 0.00,  // LOCKED: 0% for pioneers
  },
} as const;
