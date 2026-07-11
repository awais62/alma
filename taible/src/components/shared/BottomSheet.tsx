import { useEffect, type ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export default function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative bg-white rounded-t-2xl slide-up max-h-[90vh] overflow-y-auto"
        style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#E5DFD8]" />
        </div>

        {title && (
          <div className="px-6 py-3 border-b border-[#E5DFD8]">
            <h2 className="text-base font-semibold text-[#141414]">{title}</h2>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  )
}
