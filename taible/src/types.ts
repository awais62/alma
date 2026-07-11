export type GuestView = 'welcome' | 'voice' | 'menu' | 'order-review' | 'success'
export type StaffView = 'orders' | 'menu'
export type AppMode = 'guest' | 'staff'

export type OrbState = 'listening' | 'thinking' | 'speaking' | 'muted' | 'idle'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'coffee' | 'food' | 'desserts' | 'drinks'
  photo: string
  available: boolean
  ingredients?: string
  allergens?: string
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
}

export type OrderStatus = 'new' | 'preparing' | 'delivered'

export interface Order {
  id: string
  tableNumber: number
  items: CartItem[]
  status: OrderStatus
  receivedAt: Date
  total: number
  isNew?: boolean
}
