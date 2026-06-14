"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { BottomNav, type ViewKey } from "@/components/bottom-nav"
import { ForgeView } from "@/components/forge-view"
import { MarketplaceView } from "@/components/marketplace-view"
import { RentalView } from "@/components/rental-view"
import { ProfileView } from "@/components/profile-view"

export default function HomePage() {
  const [view, setView] = useState<ViewKey>("forge")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-foreground/70">Loading Nusantara Neo iNFT Forge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background batik-bg">
      <header className="sticky top-0 z-30 border-b border-border glass-card">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <div className="rounded-lg bg-primary/15 p-1.5">
            <Sparkles className="h-5 w-5 text-primary drop-shadow-[0_0_8px_var(--primary)]" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">Nusantara Neo iNFT Forge</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              ICP2E Jawa Timur
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-28 pt-5">
        {view === "forge" && <ForgeView />}
        {view === "market" && <MarketplaceView />}
        {view === "rental" && <RentalView />}
        {view === "profile" && <ProfileView />}
      </main>

      <BottomNav active={view} onChange={setView} />
    </div>
  )
}
