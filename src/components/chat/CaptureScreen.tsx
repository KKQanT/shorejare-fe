"use client"

import { Button } from "@heroui/react"
import { Camera, X } from "lucide-react"

interface ScreenCaptureProps {
  //capturedImage: string | null
  //isCapturing: boolean
  //onCaptureScreen: () => void
  //onClearCapture: () => void
}

export default function CaptureScreen({
  //capturedImage,
  //isCapturing,
  //onCaptureScreen,
  //onClearCapture,
}: ScreenCaptureProps) {
  return (
    <>
      <div className="p-2 border-b border-gray-800 bg-gray-900">
        <Button
          variant="flat"
          className="w-full flex flex-row items-center justify-center bg-gray-800 border-gray-700 rounded-md hover:bg-gray-700 hover:text-green-400 p-2 cursor-pointer"
          //onClick={onCaptureScreen}
          //disabled={isCapturing}
        >
          <Camera className="mr-2 h-4 w-4" />
          <span>Capture Trading Screen</span>
          {/*{isCapturing ? "Capturing..." : "Capture Trading Screen"}*/}
        </Button>
      </div>
    </>
  )
}
