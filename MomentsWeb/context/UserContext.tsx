"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"

// Define the User type
export interface User {
  id: string
  walletAddress: string
  isVerified: boolean
}

// Define the context interface
interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
}

// Create the context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
})

// Create a hook to use the context
export function useUser() {
  return useContext(UserContext)
}

// Create the provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage on client side
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    
    setLoading(false)
  }, [])

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
} 