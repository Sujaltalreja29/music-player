import {  useEffect, useRef } from "react"

interface AudioVisualizerProps {
    isPlaying: boolean
    colors: string[]
}

export function AudioVisualizer({ isPlaying, colors }: AudioVisualizerProps) {
    const visualizerRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()

    useEffect(() => {
        if (!visualizerRef.current || !isPlaying) return

        const canvas = visualizerRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const barCount = 32
        const barWidth = canvas.width / barCount
        const barHeights = Array(barCount)
            .fill(0)
            .map(() => Math.random() * 0.5 + 0.2)
        const barSpeeds = Array(barCount)
            .fill(0)
            .map(() => Math.random() * 0.01 + 0.005)
        const directions = Array(barCount)
            .fill(0)
            .map(() => (Math.random() > 0.5 ? 1 : -1))

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color)
            })

            ctx.fillStyle = gradient

            for (let i = 0; i < barCount; i++) {
                // Update bar heights with smooth animation
                barHeights[i] += barSpeeds[i] * directions[i]

                // Reverse direction if reaching limits
                if (barHeights[i] > 0.8 || barHeights[i] < 0.2) {
                    directions[i] *= -1
                }

                const height = barHeights[i] * canvas.height
                ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height)
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isPlaying, colors])

    return <canvas ref={visualizerRef} className="w-full h-full" width={400} height={256} />
}