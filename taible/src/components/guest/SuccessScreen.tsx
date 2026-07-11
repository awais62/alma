import { useState, useEffect } from "react"
import type { CartItem } from "../../types"

interface SuccessScreenProps {
  tableNumber: number
  restaurantName: string
  cart: CartItem[]
  orderId: string
  orderTime: Date
  total: number
  onNewOrder: () => void
}

type PrepStatus = "received" | "preparing" | "ready"

export default function SuccessScreen({
  tableNumber,
  restaurantName,
  cart,
  orderId,
  orderTime,
  total,
  onNewOrder,
}: SuccessScreenProps) {
  const [prepStatus, setPrepStatus] = useState<PrepStatus>("received")

  useEffect(() => {
    // Clear backend session so old conversation is deleted automatically
    fetch("/api/order", { method: "DELETE" }).catch(() => {})
    
    const t1 = setTimeout(() => setPrepStatus("preparing"), 6000)
    const t2 = setTimeout(() => setPrepStatus("ready"), 18000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const steps: { key: PrepStatus; label: string; emoji: string }[] = [
    { key: "received",  label: "Received",  emoji: "v" },
    { key: "preparing", label: "Preparing",  emoji: "#" },
    { key: "ready",     label: "Ready!",     emoji: "*" },
  ]
  const stepIndex = steps.findIndex(s => s.key === prepStatus)

  const formatTime = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  const eta = new Date(orderTime.getTime() + 13 * 60 * 1000)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #0D0D0D 0%, #1A1208 50%, #0D0D0D 100%)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-6">
        <div>
          <p className="text-xs font-medium" style={{ color: "#9E8E7E" }}>{restaurantName}</p>
          <p className="text-sm font-bold" style={{ color: "#D4A862" }}>Table {tableNumber}</p>
        </div>
        <span
          className="text-xs px-3 py-1.5 rounded-full font-semibold"
          style={{
            background: prepStatus === "ready" ? "rgba(91,168,92,0.15)" : "rgba(212,168,98,0.15)",
            color: prepStatus === "ready" ? "#5BA85C" : "#D4A862",
            border: prepStatus === "ready" ? "1px solid rgba(91,168,92,0.3)" : "1px solid rgba(212,168,98,0.3)",
          }}
        >
          {prepStatus === "received" ? "Received" : prepStatus === "preparing" ? "Preparing..." : "Ready!"}
        </span>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center pt-2 pb-6 px-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: "radial-gradient(circle, rgba(91,168,92,0.2) 0%, rgba(91,168,92,0.05) 100%)", border: "2px solid rgba(91,168,92,0.4)", boxShadow: "0 0 40px rgba(91,168,92,0.2)" }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#5BA85C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: "#F5F0E8" }}>Order Confirmed!</h1>
        <p className="text-sm text-center mb-1" style={{ color: "#9E8E7E" }}>
          #{orderId.slice(-6).toUpperCase()} placed at {formatTime(orderTime)}
        </p>
        <p className="text-xs text-center" style={{ color: "#6B5E50" }}>Est. ready by {formatTime(eta)}</p>
      </div>

      {/* Progress tracker */}
      <div className="mx-5 mb-5 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-xs font-semibold mb-5 uppercase tracking-widest" style={{ color: "#6B5E50" }}>Order Status</p>
        <div className="relative flex items-start justify-between">
          {/* connecting track */}
          <div className="absolute top-5 h-0.5" style={{ left: "calc(16.66%)", right: "calc(16.66%)", background: "rgba(255,255,255,0.08)", zIndex: 0 }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: stepIndex === 0 ? "0%" : stepIndex === 1 ? "50%" : "100%",
                background: "linear-gradient(90deg, #5BA85C, #D4A862)",
              }}
            />
          </div>
          {steps.map((step, i) => {
            const isActive = i <= stepIndex
            const isCurrent = i === stepIndex
            return (
              <div key={step.key} className="relative flex flex-col items-center gap-2 z-10" style={{ flex: 1 }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-700"
                  style={{
                    background: isActive ? (isCurrent ? "linear-gradient(135deg, #D4A862, #B8843A)" : "#5BA85C") : "rgba(30,25,20,1)",
                    border: isActive ? (isCurrent ? "2px solid #D4A862" : "2px solid #5BA85C") : "2px solid rgba(255,255,255,0.12)",
                    boxShadow: isCurrent ? "0 0 20px rgba(212,168,98,0.5)" : isActive ? "0 0 12px rgba(91,168,92,0.3)" : "none",
                    transform: isCurrent ? "scale(1.12)" : "scale(1)",
                    color: "white",
                  }}
                >
                  {isActive ? step.emoji : "o"}
                </div>
                <p
                  className="text-center font-semibold"
                  style={{ fontSize: "10px", color: isActive ? (isCurrent ? "#D4A862" : "#5BA85C") : "#4A3E35", maxWidth: "68px", lineHeight: 1.3 }}
                >
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order summary */}
      <div className="mx-5 mb-4 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B5E50" }}>Your Order</p>
          <p className="text-xs" style={{ color: "#9E8E7E" }}>{cart.reduce((s, i) => s + i.quantity, 0)} items</p>
        </div>
        <div className="px-5 py-1">
          {cart.map(item => (
            <div key={item.menuItem.id} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "rgba(212,168,98,0.15)", color: "#D4A862" }}>
                  {item.quantity}
                </span>
                <span className="text-sm" style={{ color: "#F0E8DC" }}>{item.menuItem.name}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "#D4A862" }}>
                {(item.menuItem.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-5 py-3" style={{ background: "rgba(212,168,98,0.06)" }}>
          <span className="text-sm font-bold" style={{ color: "#F0E8DC" }}>Total</span>
          <span className="text-lg font-bold" style={{ color: "#D4A862" }}>GBP {total.toFixed(2)}</span>
        </div>
      </div>

      {/* ETA */}
      <div className="mx-5 mb-5 flex items-center gap-4 px-5 py-4 rounded-2xl" style={{ background: "rgba(91,168,92,0.06)", border: "1px solid rgba(91,168,92,0.2)" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(91,168,92,0.15)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#5BA85C" strokeWidth="1.8" />
            <polyline points="12 6 12 12 16 14" stroke="#5BA85C" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#5BA85C" }}>12 to 15 minutes</p>
          <p className="text-xs" style={{ color: "#6B8C6B" }}>Delivery to Table {tableNumber}</p>
        </div>
      </div>

      <div className="flex-1" />

      <div className="px-5 pb-10">
        <button
          onClick={onNewOrder}
          className="w-full py-4 rounded-2xl text-sm font-semibold transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #8F5E3A, #D4A862)", color: "white", boxShadow: "0 8px 32px rgba(212,168,98,0.25)" }}
        >
          Order Something Else
        </button>
      </div>
    </div>
  )
}