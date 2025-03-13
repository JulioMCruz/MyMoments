"use client"

import { useEffect, useState } from "react"

interface ConfettiProps {
  duration?: number
  particleCount?: number
  width?: number
  height?: number
}

export default function ConfettiExplosion({
  duration = 3000,
  particleCount = 100,
  width = 1000,
  height = 800,
}: ConfettiProps) {
  const [particles, setParticles] = useState<
    Array<{
      x: number
      y: number
      color: string
      size: number
      velocity: { x: number; y: number }
      rotation: number
      rotationSpeed: number
    }>
  >([])

  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Generate random particles
    const colors = ["#FF577F", "#FF884B", "#FFDEB4", "#9376E0", "#9BABB8"]
    const newParticles = Array.from({ length: particleCount }, () => ({
      x: width / 2,
      y: height / 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      velocity: {
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15 - 3,
      },
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }))

    setParticles(newParticles)

    // Set timeout to remove particles
    const timeout = setTimeout(() => {
      setIsActive(false)
    }, duration)

    return () => clearTimeout(timeout)
  }, [duration, particleCount, width, height])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-md"
          style={{
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: isActive ? 1 : 0,
            transition: `opacity ${duration}ms ease-out`,
            animation: `confetti-fall ${duration}ms ease-out forwards`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
          }
          100% {
            transform: translateY(${height}px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

