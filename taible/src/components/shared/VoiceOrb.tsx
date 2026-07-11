import type { OrbState } from '../../types'

interface VoiceOrbProps {
  state: OrbState
  onClick?: () => void
  size?: number
}

export default function VoiceOrb({ state, onClick, size = 140 }: VoiceOrbProps) {
  const animClass =
    state === 'listening' ? 'orb-pulse' :
    state === 'thinking' ? 'orb-think' :
    state === 'speaking' ? 'orb-breathe' :
    ''

  const orbColor =
    state === 'muted' ? '#C4B5A8' :
    '#5BA85C'

  const innerOpacity =
    state === 'muted' ? 0.15 : 0.2

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-full focus:outline-none"
      style={{ width: size, height: size }}
      aria-label={`Voice orb — ${state}`}
    >
      {/* Pulse rings for listening */}
      {state === 'listening' && (
        <>
          <span className="orb-ring" style={{ animationDelay: '0s' }} />
          <span className="orb-ring" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      {/* Outer glow ring */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${orbColor}30 0%, ${orbColor}10 60%, transparent 100%)`,
        }}
      />

      {/* Main orb */}
      <span
        className={`absolute inset-3 rounded-full ${animClass}`}
        style={{
          backgroundColor: orbColor,
          boxShadow: state !== 'muted' ? `0 4px 32px ${orbColor}60, 0 0 0 1px ${orbColor}30` : 'none',
        }}
      />

      {/* Inner highlight */}
      <span
        className="absolute rounded-full"
        style={{
          width: size * 0.28,
          height: size * 0.28,
          top: size * 0.18,
          left: size * 0.24,
          background: `rgba(255,255,255,${innerOpacity})`,
          borderRadius: '50%',
          filter: 'blur(4px)',
        }}
      />

      {/* Icon */}
      <span className="relative z-10">
        {state === 'muted' ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="white"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </span>
    </button>
  )
}
