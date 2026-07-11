import type { Order, OrderStatus } from '../../types'

interface OrderCardProps {
  order: Order
  onAction: (id: string, next: OrderStatus) => void
}

const ACTION_LABEL: Record<OrderStatus, string> = {
  new: 'Accept',
  preparing: 'Mark Ready',
  delivered: 'Delivered',
}

const ACTION_NEXT: Record<string, OrderStatus | null> = {
  new: 'preparing',
  preparing: 'delivered',
  delivered: null,
}

function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins === 1) return '1 min ago'
  return `${mins} mins ago`
}

export default function OrderCard({ order, onAction }: OrderCardProps) {
  const nextStatus = ACTION_NEXT[order.status]

  return (
    <div
      className={`rounded-2xl p-4 space-y-3 ${order.isNew ? 'new-order' : ''}`}
      style={{
        backgroundColor: 'white',
        border: `1.5px solid ${order.isNew ? '#5BA85C40' : '#E5DFD8'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: '#8F5E3A15' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="8" width="18" height="4" rx="2" fill="#8F5E3A"/>
            <rect x="5" y="12" width="3" height="8" rx="1.5" fill="#8F5E3A"/>
            <rect x="16" y="12" width="3" height="8" rx="1.5" fill="#8F5E3A"/>
          </svg>
          <span className="text-sm font-bold" style={{ color: '#8F5E3A' }}>
            Table {order.tableNumber}
          </span>
        </div>
        <span className="text-xs" style={{ color: '#7A6E66' }}>
          {timeAgo(order.receivedAt)}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {order.items.map(item => (
          <div key={item.menuItem.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: '#141414' }}
              >
                {item.quantity}
              </span>
              <span className="text-sm" style={{ color: '#141414' }}>{item.menuItem.name}</span>
            </div>
            <span className="text-xs" style={{ color: '#7A6E66' }}>
              £{(item.menuItem.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#E5DFD8' }} />

      {/* Total + action */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: '#141414' }}>
          £{order.total.toFixed(2)}
        </span>
        {nextStatus && (
          <button
            onClick={() => onAction(order.id, nextStatus)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all"
            style={{
              backgroundColor:
                order.status === 'new' ? '#5BA85C' :
                order.status === 'preparing' ? '#8F5E3A' : '#7A6E66',
            }}
          >
            {ACTION_LABEL[order.status]}
          </button>
        )}
        {!nextStatus && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-xl" style={{ backgroundColor: '#F0EBE6', color: '#7A6E66' }}>
            Done
          </span>
        )}
      </div>
    </div>
  )
}
