import { createContext, useContext, useState, useEffect, type ReactNode, } from 'react'

export type CartItem = {
  coords: [number, number]
  tripId: string
  location: string
  imagePath: string
  price: number
  checkIn: string
  checkOut: string
  guests: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (tripId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  // 1. При инициализации читаем из localStorage (если есть)
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // 2. При любом изменении items сохраняем в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch {
      // silent
    }
  }, [items])

  const addToCart = (item: CartItem) => {
    setItems(prev => [...prev, item])
  }

  const removeFromCart = (tripId: string) => {
    setItems(prev => prev.filter(i => i.tripId !== tripId))
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
