import { useState } from 'react'
import type { MenuItem, CartItem } from '../../types'
import BottomSheet from '../shared/BottomSheet'

type Category = 'coffee' | 'food' | 'desserts' | 'drinks'

interface MenuScreenProps {
  items: MenuItem[]
  cart: CartItem[]
  onAddToCart: (item: MenuItem, qty: number) => void
  onOpenCart: () => void
  onBack: () => void
}

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'coffee', label: 'Coffee', emoji: '☕' },
  { key: 'food', label: 'Food', emoji: '🍳' },
  { key: 'desserts', label: 'Desserts', emoji: '🍰' },
  { key: 'drinks', label: 'Drinks', emoji: '🥤' },
]

export default function MenuScreen({ items, cart, onAddToCart, onOpenCart, onBack }: MenuScreenProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('coffee')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const filtered = items.filter(i => i.category === activeCategory)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  function getCartQty(itemId: string) {
    return cart.find(c => c.menuItem.id === itemId)?.quantity ?? 0
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: '#E5DFD8', backgroundColor: 'white' }}
      >
        <button onClick={onBack} className="p-1 -ml-1 active:scale-95">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold flex-1" style={{ color: '#141414' }}>Menu</h1>
        {cartCount > 0 && (
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white active:scale-95"
            style={{ backgroundColor: '#5BA85C' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {cartCount}
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div
        className="flex gap-2 px-5 py-3 overflow-x-auto border-b"
        style={{ borderColor: '#E5DFD8', backgroundColor: 'white' }}
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
            style={
              activeCategory === cat.key
                ? { backgroundColor: '#8F5E3A', color: 'white' }
                : { backgroundColor: '#F0EBE6', color: '#7A6E66' }
            }
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.map(item => {
          const qty = getCartQty(item.id)
          return (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'white', border: '1px solid #E5DFD8' }}
            >
              <button
                className="w-full flex gap-4 p-4 text-left active:bg-gray-50"
                onClick={() => setSelectedItem(item)}
              >
                {/* Photo */}
                <div
                  className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: '#F0EBE6' }}
                >
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold" style={{ color: '#141414' }}>{item.name}</h3>
                    {!item.available && (
                      <span
                        className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#FFF0EC', color: '#B0532F' }}
                      >
                        Sold Out
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#7A6E66' }}>
                    {item.description}
                  </p>
                  <p className="text-sm font-semibold mt-2" style={{ color: '#8F5E3A' }}>
                    £{item.price.toFixed(2)}
                  </p>
                </div>

                {/* Cart qty badge */}
                {qty > 0 && (
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: '#5BA85C' }}
                  >
                    {qty}
                  </div>
                )}
              </button>

              {/* Quick add button */}
              {item.available && (
                <div className="px-4 pb-3 flex justify-end">
                  <button
                    onClick={() => onAddToCart(item, 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium active:scale-95 transition-all"
                    style={{ backgroundColor: '#5BA85C15', color: '#5BA85C' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <line x1="12" y1="5" x2="12" y2="19" stroke="#5BA85C" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="5" y1="12" x2="19" y2="12" stroke="#5BA85C" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Item detail sheet */}
      <BottomSheet
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name}
      >
        {selectedItem && (
          <div className="p-6 space-y-5">
            <div
              className="w-full h-44 rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#F0EBE6' }}
            >
              <img
                src={selectedItem.photo}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold" style={{ color: '#141414' }}>{selectedItem.name}</h3>
                <span className="text-lg font-bold" style={{ color: '#8F5E3A' }}>
                  £{selectedItem.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#7A6E66' }}>
                {selectedItem.description}
              </p>
            </div>

            {selectedItem.ingredients && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#7A6E66' }}>
                  Ingredients
                </p>
                <p className="text-sm" style={{ color: '#141414' }}>{selectedItem.ingredients}</p>
              </div>
            )}

            {selectedItem.allergens && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#7A6E66' }}>
                  Allergens
                </p>
                <p className="text-sm" style={{ color: '#141414' }}>{selectedItem.allergens}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              {selectedItem.available ? (
                <button
                  onClick={() => { onAddToCart(selectedItem, 1); setSelectedItem(null) }}
                  className="w-full py-4 rounded-xl text-base font-semibold text-white active:scale-95"
                  style={{ backgroundColor: '#5BA85C' }}
                >
                  Add to Order — £{selectedItem.price.toFixed(2)}
                </button>
              ) : (
                <div
                  className="w-full py-4 rounded-xl text-base font-semibold text-center"
                  style={{ backgroundColor: '#FFF0EC', color: '#B0532F' }}
                >
                  Currently Unavailable
                </div>
              )}
              <button
                className="w-full py-3 rounded-xl text-sm font-medium active:scale-95"
                style={{ backgroundColor: '#F0EBE6', color: '#8F5E3A' }}
                onClick={() => setSelectedItem(null)}
              >
                Ask the assistant about this
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
