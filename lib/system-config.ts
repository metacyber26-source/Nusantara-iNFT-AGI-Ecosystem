// 4-Wallet Revenue Split Configuration (LIVE - Core Backend System - ICP2E Jatim)
export const REVENUE_SPLIT_CONFIG = {
  // Wallet addresses for automated payment distribution
  WALLET_USER: "USER_WALLET",        // 50% - Dynamically set per authenticated user
  WALLET_A_COMMUNITY: "GCSZV6PN444A476L3FTUQAOFBQQGCVAF5SU5SF2QV6AHQKSQR3O3BAP6",  // 30% - ICP2E Community
  WALLET_B_DEVELOPER: "GBOLU73OXLMQTNTX4JPWDI5THBKFDSXB2V662ZQ7WNEEMU4OVUS62SKQ",  // 10% - Developer (Ful21)
  WALLET_C_SERVER: "GAWY6AYXIDCLJE5GO5UZHPWJ6LLSH3HMFK3ETRCUADW4NFKCPB6OMIX4",     // 10% - Server/Hosting
  
  // Corrected revenue distribution percentages (50-30-10-10 Protocol - ICP2E Jatim)
  SPLITS: {
    USER: 0.50,        // 50% to authenticated user wallet (Content Creator)
    COMMUNITY: 0.30,   // 30% to ICP2E Jawa Timur community wallet
    DEVELOPER: 0.10,   // 10% to Developer (Master Ful21)
    SERVER: 0.10,      // 10% to Server/Hosting maintenance wallet
  },
} as const;

// Pi Developer Portal Domain Verification (Official Secret Key from develop.pi)
export const PI_DOMAIN_CONFIG = {
  OFFICIAL_DOMAIN: "https://nusantaraneoinft2019.pinet.com",
  VERIFICATION_SECRET: "3db048b6a692246c8ecbfba29be448df8d819cedcca5516ce95b523bdf0737f05631558a7ba564b466ef33925f14cb34a77cc52d187a89a5b042a2c98ce91df4",
  WEBHOOK_ENABLED: true,
  DOMAIN_SYNCED: true,
  VERIFIED_AT: new Date().toISOString(),
} as const;

export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SDK_LITE_URL: "https://pi-apps.github.io/pi-sdk-lite/build/production/sdklite.js",
  SANDBOX: false,
  SDK_INIT_TIMEOUT: 45000, // Increased to 45 seconds for reliable SDK loading
} as const;
