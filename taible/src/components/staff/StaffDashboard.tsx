import { useState } from 'react'
import type { Order, OrderStatus, MenuItem, StaffView } from '../../types'
import OrdersKanban from './OrdersKanban'
import StaffMenu from './StaffMenu'
import Toast from '../shared/Toast'

interface StaffDashboardProps {
  orders: Order[]
  menuItems: MenuItem[]
  onAction: (id: string, next: OrderStatus) => void
  onUpdateItem: (item: MenuItem) => void
  onSwitchToGuest: () => void
}

function TaibleLogo({ small }: { small?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5`}>
      <svg width={small ? 24 : 28} height={small ? 24 : 28} viewBox="0 0 36 36" fill="none">
        <rect x="4" y="10" width="28" height="5" rx="2.5" fill="#8F5E3A"/>
        <rect x="6" y="15" width="4" height="14" rx="2" fill="#8F5E3A"/>
        <rect x="26" y="15" width="4" height="14" rx="2" fill="#8F5E3A"/>
        <circle cx="18" cy="8" r="4" fill="#5BA85C"/>
        <rect x="17" y="6" width="2" height="6" rx="1" fill="#4A8E4B"/>
        <ellipse cx="14.5" cy="7" rx="3" ry="1.5" fill="#5BA85C" transform="rotate(-20 14.5 7)"/>
        <ellipse cx="21.5" cy="7" rx="3" ry="1.5" fill="#5BA85C" transform="rotate(20 21.5 7)"/>
      </svg>
      <span
        className={`font-bold tracking-tight ${small ? 'text-base' : 'text-lg'}`}
        style={{ color: '#141414' }}
      >
        taible
      </span>
    </div>
  )
}

export default function StaffDashboard({
  orders,
  menuItems,
  onAction,
  onUpdateItem,
  onSwitchToGuest,
}: StaffDashboardProps) {
  const [view, setView] = useState<StaffView>('orders')
  const [toast, setToast] = useState<string | null>(null)
  const [menuList, setMenuList] = useState(menuItems)

  const newCount = orders.filter(o => o.status === 'new').length

  function handleAction(id: string, next: OrderStatus) {
    onAction(id, next)
    const label = next === 'preparing' ? 'Order accepted' : next === 'delivered' ? 'Marked as delivered' : ''
    if (label) setToast(label)
  }

  function handleUpdateItem(item: MenuItem) {
    setMenuList(list => list.map(i => i.id === item.id ? item : i))
    onUpdateItem(item)
  }

  function handleAddItem() {
    setToast('Add item coming soon')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F5' }}>
      {toast && <Toast message={toast} type="success" onDismiss={() => setToast(null)} />}

      {/* Top nav */}
      <nav
        className="flex items-center justify-between px-5 lg:px-8 py-4 border-b flex-shrink-0"
        style={{ borderColor: '#E5DFD8', backgroundColor: 'white' }}
      >
        <TaibleLogo />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setView('orders')}
            className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
            style={
              view === 'orders'
                ? { backgroundColor: '#8F5E3A', color: 'white' }
                : { backgroundColor: 'transparent', color: '#7A6E66' }
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="6" height="18" rx="2" fill={view === 'orders' ? 'white' : '#7A6E66'} fillOpacity="0.9"/>
              <rect x="10" y="3" width="6" height="14" rx="2" fill={view === 'orders' ? 'white' : '#7A6E66'} fillOpacity="0.6"/>
              <rect x="18" y="3" width="4" height="10" rx="2" fill={view === 'orders' ? 'white' : '#7A6E66'} fillOpacity="0.4"/>
            </svg>
            Orders
            {newCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: '#5BA85C' }}
              >
                {newCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setView('menu')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
            style={
              view === 'menu'
                ? { backgroundColor: '#8F5E3A', color: 'white' }
                : { backgroundColor: 'transparent', color: '#7A6E66' }
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke={view === 'menu' ? 'white' : '#7A6E66'} strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="9" y1="12" x2="15" y2="12" stroke={view === 'menu' ? 'white' : '#7A6E66'} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Menu
          </button>
        </div>

        <button
          onClick={onSwitchToGuest}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium active:scale-95"
          style={{ backgroundColor: '#F0EBE6', color: '#7A6E66' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#7A6E66" strokeWidth="1.8"/>
            <circle cx="12" cy="12" r="3" stroke="#7A6E66" strokeWidth="1.8"/>
          </svg>
          Guest view
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'orders' && (
          <OrdersKanban orders={orders} onAction={handleAction} />
        )}
        {view === 'menu' && (
          <StaffMenu items={menuList} onUpdateItem={handleUpdateItem} onAddItem={handleAddItem} />
        )}
      </div>
    </div>
  )
}
