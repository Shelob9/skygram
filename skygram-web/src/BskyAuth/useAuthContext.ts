import { useContext } from "react"
import { BskyAuth, BskyAuthContext } from "./BskyAuthContext"

export function useAuthContext(): BskyAuth {
    const context = useContext(BskyAuthContext)
    if (context) {
        return context
    }

    throw new Error(`useAuthContext() must be used within an <AuthProvider />`)
  }
