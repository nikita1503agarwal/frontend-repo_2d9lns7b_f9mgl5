import React, { useCallback, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Spline from '@splinetool/react-spline'

function BurstLayer({ bursts, onComplete }) {
  return (
    <AnimatePresence>
      {bursts.map((b) => (
        <motion.span
          key={b.id}
          initial={{ opacity: 0.35, scale: 0.2, x: b.x, y: b.y }}
          animate={{ opacity: 0, scale: 3.2, x: b.x, y: b.y }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => onComplete(b.id)}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 size-24 rounded-full bg-gradient-to-r from-cyan-400/60 via-fuchsia-400/40 to-purple-500/30 blur-2xl"
        />
      ))}
    </AnimatePresence>
  )
}

function App() {
  const containerRef = useRef(null)
  const [bursts, setBursts] = useState([])
  const [pressing, setPressing] = useState(false)

  const addBurst = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = clientX - rect.left
    const y = clientY - rect.top
    const id = Math.random().toString(36).slice(2)
    setBursts((prev) => [...prev, { id, x, y }])
  }, [])

  const handleHeroClick = useCallback((e) => {
    addBurst(e.clientX, e.clientY)
  }, [addBurst])

  const removeBurst = useCallback((id) => {
    setBursts((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const gradientMask = useMemo(() => (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B11] via-[#0B0B11]/60 to-[#0B0B11]" />
      <div className="absolute inset-x-0 -top-1/3 h-[80vh] bg-[radial-gradient(80%_60%_at_50%_0%,rgba(59,130,246,.25)_0%,transparent_60%)]" />
      <div className="absolute inset-x-0 -bottom-1/3 h-[80vh] bg-[radial-gradient(60%_50%_at_50%_100%,rgba(147,51,234,.20)_0%,transparent_70%)]" />
    </div>
  ), [])

  return (
    <div className="min-h-screen w-full bg-[#0B0B11] text-white">
      {/* Navbar */}
      <header className="relative z-20">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-gradient-to-tr from-cyan-500 to-fuchsia-500 shadow-lg shadow-cyan-500/20">
              <span className="text-lg font-extrabold">C</span>
            </span>
            <span className="text-sm tracking-widest text-white/70">CENTRIX STYLE</span>
          </div>
          <nav className="hidden gap-8 text-sm text-white/70 md:flex">
            <a className="hover:text-white transition-colors" href="#">Services</a>
            <a className="hover:text-white transition-colors" href="#">Work</a>
            <a className="hover:text-white transition-colors" href="#">About</a>
            <a className="hover:text-white transition-colors" href="#">Contact</a>
          </nav>
          <button className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-md ring-1 ring-white/15 hover:bg-white/15 transition-colors">
            Let's Talk
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        ref={containerRef}
        className="relative isolate h-[88vh] w-full overflow-hidden"
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
        onClick={handleHeroClick}
      >
        {/* 3D Scene */}
        <div className="absolute inset-0">
          <Spline
            scene="https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Overlays */}
        {gradientMask}

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-4xl font-semibold leading-tight md:text-6xl"
          >
            Building premium digital experiences
            <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              that move brands forward
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-5 max-w-2xl text-pretty text-base text-white/70 md:text-lg"
          >
            We combine strategy, design, and cutting-edge engineering to ship high-impact products.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              animate={pressing ? { scale: 0.98 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={(e) => {
                // Also produce a burst from the button center
                const rect = e.currentTarget.getBoundingClientRect()
                addBurst(rect.left + rect.width / 2, rect.top + rect.height / 2)
              }}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20"
            >
              <span className="relative z-10">Start a Project</span>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-md ring-1 ring-white/15 hover:bg-white/15"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                addBurst(rect.left + rect.width / 2, rect.top + rect.height / 2)
              }}
            >
              See Our Work
            </motion.button>
          </div>
        </div>

        {/* Click burst effect layer */}
        <div className="pointer-events-none absolute inset-0">
          <BurstLayer bursts={bursts} onComplete={removeBurst} />
        </div>
      </section>

      {/* Footer strip */}
      <div className="border-t border-white/10 bg-[#0B0B11]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Your Studio</span>
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400" />
            Future-forward design & engineering
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
