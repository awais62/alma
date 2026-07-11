import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onDismiss: () => void
}

export default function Toast({ message, type = 'info', onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  const bg = type === 'success' ? '#5BA85C' : type === 'error' ? '#B0532F' : '#141414'

  return (
    <div
      className="fixed top-6 left-1/2 z-[60] transition-all duration-300"
      style={{
        transform: `translateX(-50%) ${visible ? 'translateY(0)' : 'translateY(-16px)'}`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg"
        style={{ backgroundColor: bg, minWidth: 200 }}
      >
        {type === 'success' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {message}
      </div>
    </div>
  )
}
