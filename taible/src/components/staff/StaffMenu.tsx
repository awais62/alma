import { useState } from 'react'
import type { MenuItem } from '../../types'
import Toast from '../shared/Toast'

interface StaffMenuProps {
  items: MenuItem[]
  onUpdateItem: (item: MenuItem) => void
  onAddItem: () => void
}

export default function StaffMenu({ items, onUpdateItem, onAddItem }: StaffMenuProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function toggleAvailability(item: MenuItem) {
    onUpdateItem({ ...item, available: !item.available })
    setToast(item.available ? `${item.name} marked as sold out` : `${item.name} is now available`)
  }

  return (
    <div className="h-full overflow-y-auto">
      {toast && <Toast message={toast} type="success" onDismiss={() => setToast(null)} />}

      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto">
        {/* Add item */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-semibold" style={{ color: '#141414' }}>Menu Items</h2>
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white active:scale-95"
            style={{ backgroundColor: '#5BA85C' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Item
          </button>
        </div>

        <div className="space-y-2">
          {items.map(item => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{ backgroundColor: 'white', border: '1px solid #E5DFD8', opacity: item.available ? 1 : 0.6 }}
            >
              {/* Main row */}
              <div className="flex items-center gap-4 p-4">
                {/* Photo */}
                <div
                  className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: '#F0EBE6' }}
                >
                  <img src={item.photo} alt={item.name} className="w-full h-full object-cover" loading="lazy"/>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#141414' }}>{item.name}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: '#8F5E3A' }}>
                    £{item.price.toFixed(2)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Availability toggle */}
                  <button
                    onClick={() => toggleAvailability(item)}
                    className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                    style={{ backgroundColor: item.available ? '#5BA85C' : '#E5DFD8' }}
                    aria-label={item.available ? 'Mark as sold out' : 'Mark as available'}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                      style={{ transform: item.available ? 'translateX(22px)' : 'translateX(2px)' }}
                    />
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                    className="p-2 rounded-xl active:scale-90"
                    style={{ backgroundColor: '#F0EBE6' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#8F5E3A" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#8F5E3A" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Inline edit form */}
              {editingId === item.id && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: '#E5DFD8' }}>
                  <div className="pt-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs font-medium block mb-1" style={{ color: '#7A6E66' }}>Name</label>
                        <input
                          defaultValue={item.name}
                          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                          style={{ backgroundColor: '#FAF8F5', border: '1px solid #E5DFD8', color: '#141414' }}
                          onBlur={e => onUpdateItem({ ...item, name: e.target.value })}
                        />
                      </div>
                      <div style={{ width: 100 }}>
                        <label className="text-xs font-medium block mb-1" style={{ color: '#7A6E66' }}>Price (£)</label>
                        <input
                          type="number"
                          step="0.50"
                          defaultValue={item.price}
                          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                          style={{ backgroundColor: '#FAF8F5', border: '1px solid #E5DFD8', color: '#141414' }}
                          onBlur={e => onUpdateItem({ ...item, price: parseFloat(e.target.value) || item.price })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: '#7A6E66' }}>Description</label>
                      <input
                        defaultValue={item.description}
                        className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                        style={{ backgroundColor: '#FAF8F5', border: '1px solid #E5DFD8', color: '#141414' }}
                        onBlur={e => onUpdateItem({ ...item, description: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => { setEditingId(null); setToast('Changes saved') }}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-white active:scale-95"
                        style={{ backgroundColor: '#5BA85C' }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
