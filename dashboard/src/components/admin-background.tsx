'use client'

import dynamic from 'next/dynamic'

const ColorBends = dynamic(
  () => import('@/components/color-bends').then((m) => m.ColorBends),
  { ssr: false },
)

const OUREN_BLUES = ['#000A67', '#1A2FA0', '#3B5BDB']

export function AdminBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white" aria-hidden="true">
      <div className="absolute inset-0 opacity-55">
        <ColorBends colors={OUREN_BLUES} />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 20%, rgba(203, 223, 238, 0.35) 0%, transparent 45%), linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.78) 45%, rgba(255, 255, 255, 0.92) 100%)',
        }}
      />
    </div>
  )
}
