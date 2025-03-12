"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import jsQR from "jsqr"

interface QRCodeScannerDialogProps {
  isOpen: boolean
  onClose: () => void
  onScan: (result: string) => void
}

export function QRCodeScannerDialog({ isOpen, onClose, onScan }: QRCodeScannerDialogProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsVideoReady(false)
  }, [stream])

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isOpen, startCamera, stopCamera])

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current && isVideoReady) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const aspectRatio = video.videoWidth / video.videoHeight
      canvas.width = video.clientWidth
      canvas.height = canvas.width / aspectRatio
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        return ctx.getImageData(0, 0, canvas.width, canvas.height)
      }
    }
    return null
  }, [isVideoReady])

  const scanQRCode = useCallback(() => {
    const imageData = captureFrame()
    if (imageData) {
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        onScan(code.data)
        onClose()
      }
    }
  }, [captureFrame, onClose, onScan])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isVideoReady) {
      interval = setInterval(scanQRCode, 500) // Scan every 500ms
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isVideoReady, scanQRCode])

  const handleVideoPlay = useCallback(() => {
    setIsVideoReady(true)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="mt-4 relative">
          <video ref={videoRef} onCanPlay={handleVideoPlay} autoPlay playsInline muted className="w-full h-auto" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

