import type { Language, InftFormat } from "./forge-config"
import type { CognitiveProfile } from "./cognitive-agent"

export type Inft = {
  id: string
  name: string
  creator: string
  format: InftFormat
  languages: Language[]
  price: number // in Pi
  rentPricePerDay?: number
  description: string
  polyCount: string
  rigged: boolean
  forSale: boolean
  forRent: boolean
  motif: string // batik motif accent class
  cognitiveProfile?: CognitiveProfile // Autonomous Cognitive Agent
}

// Cached marketplace seed data (browse without login)
export const MARKETPLACE_SEED: Inft[] = [
  {
    id: "nft-001",
    name: "Gatotkaca Vanguard",
    creator: "Ful21",
    format: "3D",
    languages: ["EN", "ID", "JV"],
    price: 12.5,
    rentPricePerDay: 0.8,
    description:
      "Wayang-inspired flying warrior avatar with full skeleton rig, ready for Web3 battle arenas.",
    polyCount: "8.2k tris (low-poly optimized)",
    rigged: true,
    forSale: true,
    forRent: true,
    motif: "motif-kawung",
  },
  {
    id: "nft-002",
    name: "Reog Spirit Mask",
    creator: "Murtini79",
    format: "3D",
    languages: ["ID", "JV"],
    price: 9.0,
    rentPricePerDay: 0.5,
    description:
      "Ponorogo Reog mask wearable with VRM export and emotive facial blendshapes.",
    polyCount: "5.6k tris",
    rigged: true,
    forSale: true,
    forRent: false,
    motif: "motif-parang",
  },
  {
    id: "nft-003",
    name: "Batik Companion AI",
    creator: "SIREP74",
    format: "Text",
    languages: ["EN", "ID", "JV"],
    price: 4.2,
    description:
      "Conversational guide iNFT that narrates Nusantara folklore in three languages.",
    polyCount: "n/a (text agent)",
    rigged: false,
    forSale: true,
    forRent: false,
    motif: "motif-mega",
  },
  {
    id: "nft-004",
    name: "Gamelan Loop Pack",
    creator: "ifah24",
    format: "Audio",
    languages: ["ID"],
    price: 3.0,
    rentPricePerDay: 0.2,
    description:
      "Spatial gamelan ambient audio iNFT for metaverse lobbies and game scenes.",
    polyCount: "n/a (audio asset)",
    rigged: false,
    forSale: true,
    forRent: true,
    motif: "motif-truntum",
  },
  {
    id: "nft-005",
    name: "Singo Barong Mount",
    creator: "afifmasfiqo",
    format: "3D",
    languages: ["EN", "ID"],
    price: 18.0,
    rentPricePerDay: 1.2,
    description:
      "Rideable lion-peacock creature with seamless mesh deformation and FBX export.",
    polyCount: "11.4k tris (low-poly)",
    rigged: true,
    forSale: true,
    forRent: true,
    motif: "motif-kawung",
  },
  {
    id: "nft-006",
    name: "Candi Glyph Sprite",
    creator: "Tar72",
    format: "2D",
    languages: ["EN", "JV"],
    price: 2.5,
    description:
      "Animated temple glyph 2D sprite-sheet converted into an interactive emblem iNFT.",
    polyCount: "n/a (2D sprite)",
    rigged: false,
    forSale: true,
    forRent: false,
    motif: "motif-parang",
  },
]

export type RentalListing = {
  id: string
  inftName: string
  lender: string
  format: InftFormat
  pricePerDay: number
  minDays: number
  maxDays: number
  escrowDeposit: number
  status: "available" | "rented"
}

export const RENTAL_SEED: RentalListing[] = [
  {
    id: "rent-001",
    inftName: "Gatotkaca Vanguard",
    lender: "Ful21",
    format: "3D",
    pricePerDay: 0.8,
    minDays: 1,
    maxDays: 30,
    escrowDeposit: 5.0,
    status: "available",
  },
  {
    id: "rent-002",
    inftName: "Singo Barong Mount",
    lender: "afifmasfiqo",
    format: "3D",
    pricePerDay: 1.2,
    minDays: 3,
    maxDays: 14,
    escrowDeposit: 8.0,
    status: "available",
  },
  {
    id: "rent-003",
    inftName: "Gamelan Loop Pack",
    lender: "ifah24",
    format: "Audio",
    pricePerDay: 0.2,
    minDays: 1,
    maxDays: 60,
    escrowDeposit: 1.0,
    status: "rented",
  },
]
