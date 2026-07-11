"use client"
import { useState, useEffect, useCallback } from "react"

type OrderStatus = "new" | "preparing" | "ready" | "delivered"

interface KitchenItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface KitchenOrder {
  id: string
  tableNumber: number
  items: KitchenItem[]
  total: number
  status: OrderStatus
  receivedAt: string
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; border: string; label: string; dot: string }> = {
  new:       { bg: "#0D1F0D", border: "rgba(91,168,92,0.5)",  label: "New Order",  dot: "#5BA85C" },
  preparing: { bg: "#1F170D", border: "rgba(212,168,98,0.5)", label: "Preparing",  dot: "#D4A862" },
  ready:     { bg: "#0D1520", border: "rgba(99,149,212,0.5)", label: "Ready",      dot: "#6395D4" },
  delivered: { bg: "#141414", border: "rgba(100,100,100,0.3)",label: "Delivered",  dot: "#666"   },
}

const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
  new: "preparing",
  preparing: "ready",
  ready: "delivered",
  delivered: null,
}

const STATUS_BTN: Record<OrderStatus, string> = {
  new: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Delivered",
  delivered: "",
}

function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 1) return "Just now"
  if (mins === 1) return "1 min ago"
  return `${mins} mins ago`
}

function OrderTicket({ order, onAction }: { order: KitchenOrder; onAction: (id: string, status: OrderStatus) => void }) {
  const style = STATUS_COLORS[order.status]
  const next = STATUS_NEXT[order.status]
  const [tick, setTick] = useState(0)

  // Live time counter
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 transition-all"
      style={{ background: style.bg, border: `2px solid ${style.border}` }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: style.dot }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: style.dot }}>
            {style.label}
          </span>
        </div>
        <span className="text-xs" style={{ color: "#6B5E50" }}>{timeAgo(order.receivedAt)}</span>
      </div>

      {/* Table + ID */}
      <div className="flex items-center justify-between">
        <div className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(212,168,98,0.1)", border: "1px solid rgba(212,168,98,0.2)" }}>
          <span className="text-base font-bold" style={{ color: "#D4A862" }}>Table {order.tableNumber}</span>
        </div>
        <span className="text-xs font-mono" style={{ color: "#4A3E32" }}>#{order.id.slice(-6).toUpperCase()}</span>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.08)", color: "#F0E8DC" }}>
              {item.quantity}
            </span>
            <span className="text-sm font-semibold" style={{ color: "#F0E8DC" }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

      {/* Total + Action */}
      <div className="flex items-center justify-between">
        <span className="font-bold" style={{ color: "#D4A862" }}>GBP {order.total.toFixed(2)}</span>
        {next ? (
          <button onClick={() => onAction(order.id, next)}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white active:scale-95 transition-all"
            style={{
              background: next === "preparing" ? "linear-gradient(135deg,#4A9E4B,#5BA85C)"
                        : next === "ready"     ? "linear-gradient(135deg,#3A6B9E,#6395D4)"
                                               : "rgba(100,100,100,0.3)"
            }}>
            {STATUS_BTN[order.status]}
          </button>
        ) : (
          <span className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "rgba(100,100,100,0.15)", color: "#666" }}>
            ✓ Done
          </span>
        )}
      </div>
    </div>
  )
}

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [lastCount, setLastCount] = useState(0)
  const [newAlert, setNewAlert] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/kitchen")
      const data = await res.json()
      if (Array.isArray(data)) {
        setOrders(data)
        if (data.length > lastCount && lastCount > 0) setNewAlert(true)
        setLastCount(data.length)
      }
    } catch { /* ignore */ }
  }, [lastCount])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 2000) // poll every 2s
    return () => clearInterval(interval)
  }, [fetchOrders])

  useEffect(() => {
    if (newAlert) {
      const t = setTimeout(() => setNewAlert(false), 4000)
      return () => clearTimeout(t)
    }
  }, [newAlert])

  async function handleAction(id: string, status: OrderStatus) {
    await fetch("/api/kitchen", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    fetchOrders()
  }

  const byStatus = (s: OrderStatus) => orders.filter(o => o.status === s)
  const activeCount = orders.filter(o => o.status !== "delivered").length

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", fontFamily: "'Inter', sans-serif" }}>
      {/* New order alert */}
      {newAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-white font-bold text-sm animate-bounce"
          style={{ background: "linear-gradient(135deg,#5BA85C,#4A9E4B)", boxShadow: "0 8px 32px rgba(91,168,92,0.5)" }}>
          🔔 New Order Received!
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#5BA85C,#4A9E4B)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Kitchen Dashboard</h1>
            <p className="text-xs" style={{ color: "#6B5E50" }}>Taible Bistro — Live Orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold" style={{ color: "#9E8E7E" }}>
            {activeCount} active
          </span>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {(["new", "preparing", "ready", "delivered"] as OrderStatus[]).map(status => {
          const col = byStatus(status)
          const style = STATUS_COLORS[status]
          return (
            <div key={status} className="flex flex-col gap-3">
              {/* Column header */}
              <div className="flex items-center gap-2 px-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: style.dot }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: style.dot }}>
                  {style.label}
                </span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#6B5E50" }}>
                  {col.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 min-h-32">
                {col.length === 0 ? (
                  <div className="rounded-2xl py-10 flex items-center justify-center"
                    style={{ border: "1.5px dashed rgba(255,255,255,0.06)" }}>
                    <span className="text-xs" style={{ color: "#3A3330" }}>No orders</span>
                  </div>
                ) : (
                  col.map(order => (
                    <OrderTicket key={order.id} order={order} onAction={handleAction} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-24 gap-4 opacity-40">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h12" stroke="#9E8E7E" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-sm" style={{ color: "#9E8E7E" }}>Waiting for orders...</p>
        </div>
      )}
    </div>
  )
}
