"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { PRODUCT_CONFIG, PRODUCT_PRICING } from "@/lib/product-config"

interface OnboardingPaymentButtonProps {
  onSuccess?: () => void
  onClose?: () => void
}

export function OnboardingPaymentButton({ onSuccess, onClose }: OnboardingPaymentButtonProps) {
  const { products, sdk } = usePiAuth()
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(true)
  const [result, setResult] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const mainProductId = PRODUCT_CONFIG.PRODUCT_6a2a049447f1cd1b7ccb7e68
  const product = products?.find((p) => p.id === mainProductId)
  const productInfo = PRODUCT_PRICING[mainProductId as keyof typeof PRODUCT_PRICING]

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowDialog(false)
      setResult(null)
      onClose?.()
    } else {
      setShowDialog(true)
    }
  }

  const handlePurchase = async () => {
    if (!sdk || !product) {
      setResult({
        type: "error",
        message: "SDK or Product not initialized. Please refresh the page.",
      })
      return
    }

    try {
      setLoading(true)
      const purchaseResult = await sdk.makePurchase({ productId: product.id })
      
      if (purchaseResult && purchaseResult.paymentId) {
        setResult({
          type: "success",
          message: "Purchase successful! Redirecting...",
        })
        
        setTimeout(() => {
          onSuccess?.()
          window.location.reload()
        }, 1500)
      } else {
        setResult({
          type: "error",
          message: "Purchase failed. Please try again.",
        })
      }
    } catch (err) {
      const error = err as any
      let errorMessage = "An error occurred. Please try again."
      if (error?.code === "purchase_cancelled") {
        errorMessage = "Purchase cancelled. Your payment was not processed."
      } else if (error?.code === "product_not_found") {
        errorMessage = "Product not found. Backend configuration issue."
      } else if (error?.code === "purchase_error") {
        errorMessage = error?.message || "Purchase error."
      }
      
      setResult({
        type: "error",
        message: errorMessage,
        
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        {!product || !productInfo ? (
          /* TAMPILAN LOADING JIKA PRODUK BELUM SIAP */
          <>
            <DialogHeader>
              <DialogTitle>Initializing...</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading product dari Pi Network...</p>
            </div>
          </>
        ) : (
          /* TAMPILAN UTAMA JIKA PRODUK SUDAH SIAP */
          <>
            <DialogHeader>
              <div className="mb-4 flex justify-center">
                <div className="rounded-lg bg-primary/15 p-3">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">Nusantara Neo iNFT Forge</DialogTitle>
              <DialogDescription className="text-center">ICP2E Blitar Raya Community</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {result ? (
                <Alert variant={result.type === "success" ? "default" : "destructive"}>
                  <AlertDescription className="flex items-center gap-2">
                    {result.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    {result.message}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-medium">Unlock full access to AGI-powered studio</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Generate, auto-rig, and mint multi-format 3D iNFTs featuring Nusantara culture themes with live WebGL preview and rental systems.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">ONE-TIME UNLOCK PRICE</p>
                    <p className="text-2xl font-bold text-primary">{productInfo.price} Pi</p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              {!result && (
                <>
                  <Button variant="outline" onClick={() => handleDialogClose(false)}>Cancel</Button>
                  <Button onClick={handlePurchase} disabled={loading} className="flex-1">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loading ? "Processing..." : `Unlock for ${productInfo.price} Pi`}
                  </Button>
                </>
              )}
              {result?.type === "success" && (
                <Button onClick={() => handleDialogClose(false)} className="w-full">Close</Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

