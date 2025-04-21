"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Translation } from "@/types/translation"
import { Play, Pause, RotateCcw, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import FingerSpellingDisplay from "./finger-spelling-display"

interface TranslationDisplayProps {
  translation: Translation
}

export default function TranslationDisplay({ translation }: TranslationDisplayProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  // Auto-play when a new translation is received
  useEffect(() => {
    setCurrentWordIndex(0)
    setIsPlaying(true)
  }, [translation])

  // Handle auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      if (currentWordIndex < translation.words.length - 1) {
        setCurrentWordIndex((prev) => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, 3000) // Show each word for 3 seconds to allow for finger spelling

    return () => clearTimeout(timer)
  }, [isPlaying, currentWordIndex, translation.words.length])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setCurrentWordIndex(0)
    setIsPlaying(true)
  }

  const handleNext = () => {
    if (currentWordIndex < translation.words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1)
    }
  }

  const currentWord = translation.words[currentWordIndex]

  return (
    <div className="space-y-4">
      <Card className="border-2 border-teal-200 shadow-md overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-medium text-gray-700">"{translation.originalText}"</h2>
            <p className="text-sm text-gray-500">
              {currentWordIndex + 1} of {translation.words.length}
            </p>
          </div>

          <div className="relative aspect-square max-w-xs mx-auto bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center overflow-hidden">
            {/* Sign display area */}
            <div className="text-center p-4 w-full">
              <div className="mb-4 text-lg font-medium text-teal-800">{currentWord.original}</div>

              {/* Use finger spelling display for the word */}
              <FingerSpellingDisplay
                word={currentWord.original}
                onComplete={() => {
                  if (isPlaying && currentWordIndex < translation.words.length - 1) {
                    setCurrentWordIndex((prev) => prev + 1)
                  } else if (isPlaying) {
                    setIsPlaying(false)
                  }
                }}
              />
            </div>

            {/* Info overlay */}
            {showInfo && (
              <div className="absolute inset-0 bg-black/70 text-white p-4 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-bold mb-2">{currentWord.original}</h3>
                  <p className="text-sm">
                    This word is shown using ASL finger spelling, where each letter is represented by a specific hand
                    position.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInfo(false)}
                    className="mt-4 text-white border-white hover:bg-white/20"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentWordIndex === 0}
              className="rounded-full"
            >
              <span className="sr-only">Previous</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>

            <Button onClick={handlePlayPause} variant="outline" className="rounded-full">
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentWordIndex === translation.words.length - 1}
              className="rounded-full"
            >
              <span className="sr-only">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            <Button variant="ghost" size="sm" onClick={handleRestart} className="text-gray-600">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)} className="text-gray-600">
                    <Info className="h-4 w-4 mr-2" />
                    Info
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show information about this sign</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
