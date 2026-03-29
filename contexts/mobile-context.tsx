"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface MobileContextType {
  isMobile: boolean
  isTablet: boolean
}

const MobileContext = createContext<MobileContextType | undefined>(undefined)

export function MobileProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    // Verificar tamanho inicial
    checkScreenSize()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkScreenSize)

    // Limpar listener
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        isTablet,
      }}
    >
      {children}
    </MobileContext.Provider>
  )
}

export function useMobile() {
  const context = useContext(MobileContext)
  if (context === undefined) {
    throw new Error("useMobile must be used within a MobileProvider")
  }
  return context
}
