import type { CartItem } from "../../types"
import BottomSheet from "../shared/BottomSheet"

interface OrderReviewSheetProps {
  open: boolean
  cart: CartItem[]
  onConfirm: () => void
  onClose: () => void
  onKeepTalking: () => void
  onRemoveItem: (itemId: string) => void
}

export default function OrderReviewSheet({
  open,
  cart,
  onConfirm,
  onClose,
  onKeepTalking,
  onRemoveItem,
}: OrderReviewSheetProps) {
  const total = cart.reduce((s, i) => s + i.menuItem.price * i.quantity, 0)
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <BottomSheet open={open} onClose={onClose} title="Your Order">
      <div>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(91,168,92,0.08)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="21" r="1" fill="#5BA85C" />
                <circle cx="20" cy="21" r="1" fill="#5BA85C" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="#5BA85C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "#141414" }}>Cart is empty</p>
            <p className="text-xs mb-5" style={{ color: "#9E8E7E" }}>Just say what you would like to order</p>
            <button
              onClick={onKeepTalking}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #5BA85C, #4A9E4B)", boxShadow: "0 4px 16px rgba(91,168,92,0.3)" }}
            >
              Start Talking
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 pt-2 pb-4" style={{ borderBottom: "1px solid #F0EBE6" }}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#C4B5A8" }}>
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </p>
              <button onClick={onKeepTalking} className="text-xs font-semibold" style={{ color: "#8F5E3A" }}>
                + Add More
              </button>
            </div>

            <div className="px-6 py-2">
              {cart.map(item => (
                <div key={item.menuItem.id} className="flex items-center gap-4 py-3.5" style={{ borderBottom: "1px solid #F5F0EB" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #8F5E3A, #B8743A)" }}>
                    {item.quantity}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#141414" }}>{item.menuItem.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#9E8E7E" }}>GBP {item.menuItem.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold" style={{ color: "#8F5E3A" }}>GBP {(item.menuItem.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => onRemoveItem(item.menuItem.id)} className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-all" style={{ background: "rgba(176,83,47,0.1)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#B0532F" strokeWidth="2.2" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-6 py-4 mx-5 mt-4 rounded-2xl" style={{ background: "rgba(143,94,58,0.06)", border: "1px solid rgba(143,94,58,0.12)" }}>
              <span className="text-sm font-semibold" style={{ color: "#141414" }}>Total</span>
              <span className="text-xl font-bold" style={{ color: "#8F5E3A" }}>GBP {total.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 px-6 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#9E8E7E" strokeWidth="1.5" />
                <polyline points="12 6 12 12 16 14" stroke="#9E8E7E" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-xs" style={{ color: "#9E8E7E" }}>Estimated delivery: 12 to 15 min to your table</p>
            </div>

            <div className="flex flex-col gap-3 px-6 pb-8 mt-2">
              <button
                onClick={onConfirm}
                className="w-full py-4 rounded-2xl text-base font-bold text-white active:scale-98 transition-all"
                style={{ background: "linear-gradient(135deg, #5BA85C, #4A9E4B)", boxShadow: "0 8px 24px rgba(91,168,92,0.35)" }}
              >
                Confirm Order - GBP {total.toFixed(2)}
              </button>
              <button onClick={onKeepTalking} className="w-full py-3.5 rounded-2xl text-sm font-semibold active:scale-95" style={{ backgroundColor: "#F0EBE6", color: "#8F5E3A" }}>
                Keep Talking
              </button>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  )
}