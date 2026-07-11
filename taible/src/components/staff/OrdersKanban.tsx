import type { Order, OrderStatus } from '../../types'
import OrderCard from './OrderCard'

interface OrdersKanbanProps {
  orders: Order[]
  onAction: (id: string, next: OrderStatus) => void
}

const COLUMNS: { status: OrderStatus; label: string; dot: string }[] = [
  { status: 'new', label: 'New', dot: '#5BA85C' },
  { status: 'preparing', label: 'Preparing', dot: '#8F5E3A' },
  { status: 'delivered', label: 'Delivered', dot: '#C4B5A8' },
]

export default function OrdersKanban({ orders, onAction }: OrdersKanbanProps) {
  const grouped = (status: OrderStatus) => orders.filter(o => o.status === status)

  return (
    <div className="h-full overflow-hidden">
      {/* Mobile: stacked */}
      <div className="block lg:hidden overflow-y-auto h-full px-4 pb-8 space-y-8 pt-4">
        {COLUMNS.map(col => {
          const colOrders = grouped(col.status)
          return (
            <div key={col.status}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dot }} />
                <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#7A6E66' }}>
                  {col.label}
                </h2>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#F0EBE6', color: '#7A6E66' }}
                >
                  {colOrders.length}
                </span>
              </div>
              {colOrders.length === 0 ? (
                <div
                  className="rounded-2xl py-8 flex flex-col items-center gap-2"
                  style={{ border: '1.5px dashed #E5DFD8' }}
                >
                  <span className="text-xs" style={{ color: '#C4B5A8' }}>No orders</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {colOrders.map(o => (
                    <OrderCard key={o.id} order={o} onAction={onAction} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop: kanban columns */}
      <div className="hidden lg:grid grid-cols-3 gap-6 h-full overflow-hidden px-6 pb-8 pt-4" style={{ gridTemplateRows: '1fr' }}>
        {COLUMNS.map(col => {
          const colOrders = grouped(col.status)
          return (
            <div key={col.status} className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.dot }} />
                <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#7A6E66' }}>
                  {col.label}
                </h2>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#F0EBE6', color: '#7A6E66' }}
                >
                  {colOrders.length}
                </span>
              </div>

              <div
                className="flex-1 overflow-y-auto rounded-2xl p-3 space-y-3"
                style={{ backgroundColor: '#F5F0EB' }}
              >
                {colOrders.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-16">
                    <span className="text-xs" style={{ color: '#C4B5A8' }}>No orders</span>
                  </div>
                ) : (
                  colOrders.map(o => (
                    <OrderCard key={o.id} order={o} onAction={onAction} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
