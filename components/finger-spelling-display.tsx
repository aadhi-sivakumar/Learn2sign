"use client"

import { useState, useEffect } from "react"

interface FingerSpellingDisplayProps {
  word: string
  onComplete?: () => void
}

interface LetterData {
  char: string
  type: string
  imagePath: string | null
}

export default function FingerSpellingDisplay({ word, onComplete }: FingerSpellingDisplayProps) {
  const [letters, setLetters] = useState<LetterData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchLetterImages = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching letter images for:", word)

        // If we don't have a word, create a placeholder
        if (!word || word.trim() === "") {
          setLetters([])
          setLoading(false)
          return
        }

        // Fallback implementation in case the API fails
        const fallbackLetters = word
          .toLowerCase()
          .split("")
          .map((char) => {
            if (char === " ") {
              return {
                char,
                type: "space",
                imagePath: "/placeholder.svg?height=200&width=200&text=Space",
              }
            } else if (/[a-z]/.test(char)) {
              return {
                char,
                type: "letter",
                imagePath: `/images/asl_alphabet/${char}_test.jpg`,
              }
            } else {
              return {
                char,
                type: "unsupported",
                imagePath: `/placeholder.svg?height=200&width=200&text=${char}`,
              }
            }
          })

        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: word }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("API error response:", errorData)
            throw new Error(`API returned ${response.status}: ${errorData.error || response.statusText}`)
          }

          const data = await response.json()
          console.log("API response:", data)

          if (data.result && Array.isArray(data.result)) {
            setLetters(data.result)
          } else {
            console.warn("Unexpected API response format, using fallback", data)
            setLetters(fallbackLetters)
          }
        } catch (apiError) {
          console.error("API fetch error:", apiError)
          console.log("Using fallback letter data")
          setLetters(fallbackLetters)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error in fetchLetterImages:", err)
      } finally {
        setLoading(false)
      }
    }

    if (word) {
      fetchLetterImages()
      setCurrentIndex(0)
    }
  }, [word])

  // Auto-advance through the letters
  useEffect(() => {
    if (!letters.length || currentIndex >= letters.length - 1) return

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= letters.length && onComplete) {
          onComplete()
        }
        return next < letters.length ? next : prev
      })
    }, 1000) // Show each letter for 1 second

    return () => clearTimeout(timer)
  }, [currentIndex, letters, onComplete])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 bg-red-50 rounded-lg">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!letters.length) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No letters to display</p>
      </div>
    )
  }

  const currentLetter = letters[currentIndex]

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center justify-center">
        <div className="text-sm text-gray-500 mr-2">
          Letter {currentIndex + 1} of {letters.length}:
        </div>
        <div className="text-xl font-bold text-teal-700">
          {currentLetter.char === " " ? "[space]" : currentLetter.char.toUpperCase()}
        </div>
      </div>

      <div className="relative w-48 h-48 bg-white rounded-lg shadow-md overflow-hidden">
        {currentLetter.type === "letter" && currentLetter.imagePath ? (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={currentLetter.imagePath || "/placeholder.svg"}
              alt={`ASL sign for letter ${currentLetter.char}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                // If image fails to load, replace with placeholder
                const target = e.target as HTMLImageElement
                target.src = `/placeholder.svg?height=200&width=200&text=${currentLetter.char.toUpperCase()}`
              }}
            />
          </div>
        ) : currentLetter.type === "space" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-300 text-4xl">⎵</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">{currentLetter.char}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-1">
        {letters.map((letter, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              index === currentIndex ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {letter.char === " " ? "⎵" : letter.char}
          </button>
        ))}
      </div>
    </div>
  )
}
