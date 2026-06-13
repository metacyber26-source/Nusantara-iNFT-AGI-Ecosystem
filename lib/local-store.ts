"use client"

import type { Inft } from "./forge-data"
import type { Language } from "./forge-config"

const KEYS = {
  minted: "nnif_minted_v1",
  prefs: "nnif_prefs_v1",
  rentals: "nnif_active_rentals_v1",
}

export type UserPrefs = {
  preferredLanguage: Language
  username: string
}

export type ActiveRental = {
  id: string
  inftName: string
  days: number
  totalCost: number
  startedAt: number
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota errors
  }
}

export function loadMinted(): Inft[] {
  return read<Inft[]>(KEYS.minted, [])
}
export function saveMinted(items: Inft[]): void {
  write(KEYS.minted, items)
}

export function loadPrefs(): UserPrefs {
  return read<UserPrefs>(KEYS.prefs, { preferredLanguage: "EN", username: "" })
}
export function savePrefs(prefs: UserPrefs): void {
  write(KEYS.prefs, prefs)
}

export function loadRentals(): ActiveRental[] {
  return read<ActiveRental[]>(KEYS.rentals, [])
}
export function saveRentals(items: ActiveRental[]): void {
  write(KEYS.rentals, items)
}
