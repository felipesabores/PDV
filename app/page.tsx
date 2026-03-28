"use client"

import { POSProvider } from "@/contexts/pos-context"
import { MobileProvider } from "@/contexts/mobile-context"
import { POSMain } from "@/components/pos-main"

export default function POSPage() {
  return (
    <POSProvider>
      <MobileProvider>
        <POSMain />
      </MobileProvider>
    </POSProvider>
  )
}

