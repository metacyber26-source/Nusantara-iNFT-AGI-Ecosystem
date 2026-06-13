// Static config baked at build time for Nusantara Neo iNFT Forge

export const WHITELIST_USERNAMES = [
  "Ful21",
  "Murtini79",
  "SIREP74",
  "ifah24",
  "Muhammadefendi123",
  "Titin999",
  "afifmasfiqo",
  "Tar72",
  "Rid81",
] as const

export function normalizeUsername(username: string): string {
  return username.trim().replace(/^@/, "").toLowerCase()
}

export function isWhitelisted(username: string | null | undefined): boolean {
  if (!username) return false
  const norm = normalizeUsername(username)
  return WHITELIST_USERNAMES.some((u) => u.toLowerCase() === norm)
}

export type RevenueSplit = { label: string; percent: number }

// Revenue-sharing static config (locked smart-contract logic)
export const PRIMARY_SALE_SPLIT: RevenueSplit[] = [
  { label: "User", percent: 50 },
  { label: "ICP2E Jatim Community Pool", percent: 25 },
  { label: "Developer", percent: 10 },
  { label: "Server", percent: 10 },
  { label: "Gas", percent: 5 },
]

export const RENT_INCOME_SPLIT: RevenueSplit[] = PRIMARY_SALE_SPLIT

export const MINT_FEE_SPLIT: RevenueSplit[] = [
  { label: "ICP2E Jatim Community Pool", percent: 35 },
  { label: "Server", percent: 40 },
  { label: "Developer", percent: 15 },
  { label: "Gas", percent: 10 },
]

export const SECONDARY_ROYALTY_SPLIT: RevenueSplit[] = [
  { label: "Original Creator", percent: 50 },
  { label: "ICP2E Jatim Community Pool", percent: 30 },
  { label: "Developer", percent: 20 },
]

export const PLATFORM_FEE_PERCENT = 5 // standard platform fee
export const GAS_FEE_PI = 0.01 // flat gas estimate

export type Language = "EN" | "ID" | "JV"
export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "EN", label: "English", native: "English" },
  { code: "ID", label: "Indonesian", native: "Bahasa Indonesia" },
  { code: "JV", label: "Javanese", native: "Basa Jawa" },
]

export type InftFormat = "3D" | "2D" | "Text" | "Audio"
export type ExportFormat = "GLTF" | "GLB" | "FBX" | "VRM"
export const EXPORT_FORMATS: ExportFormat[] = ["GLTF", "GLB", "FBX", "VRM"]
