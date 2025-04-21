"use client"

import { useState } from "react"

interface SignLanguageDisplayProps {
  word: string
}

export default function SignLanguageDisplay({ word }: SignLanguageDisplayProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate a consistent color based on the word
  const getWordColor = (word: string) => {
    let hash = 0
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Generate teal/cyan hues (170-190 degrees)
    const h = 170 + (Math.abs(hash) % 20)
    return `hsl(${h}, 70%, 60%)`
  }

  // Create a visual representation of the word in ASL
  const renderWordVisual = () => {
    const letters = word.toLowerCase().split("")

    return (
      <div className="flex flex-wrap justify-center gap-2 p-4">
        {letters.map((letter, index) => {
          if (letter === " ") {
            return <div key={index} className="w-12 h-1 bg-gray-300 self-center mx-2" />
          }

          if (!/[a-z]/.test(letter)) {
            return (
              <div key={index} className="w-12 h-12 flex items-center justify-center text-gray-400 text-lg">
                {letter}
              </div>
            )
          }

          return (
            <div key={index} className="relative w-12 h-12 bg-white rounded-md shadow-sm overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url('/images/asl-alphabet.jpeg')`,
                  backgroundPosition: getLetterPosition(letter),
                  backgroundSize: "700%",
                  transform: "scale(1.2)",
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }

  // Calculate the position for a letter in the alphabet image
  const getLetterPosition = (letter: string) => {
    const letterCode = letter.charCodeAt(0) - 97 // 'a' is 97 in ASCII

    if (letterCode < 0 || letterCode > 25) {
      return "0% 0%"
    }

    // Calculate row and column for positioning
    // The image has 4 rows with 7, 7, 7, and 5 letters respectively
    let row = 0
    let col = 0

    if (letterCode < 7) {
      row = 0
      col = letterCode
    } else if (letterCode < 14) {
      row = 1
      col = letterCode - 7
    } else if (letterCode < 21) {
      row = 2
      col = letterCode - 14
    } else {
      row = 3
      col = letterCode - 21
    }

    // Calculate percentage positions for object-position
    // Each letter takes approximately 1/7 of the width (about 14.3%)
    // Each row takes 1/4 of the height (25%)
    const xPosition = `${col * 14.3}%`
    const yPosition = `${row * 25}%`

    return `${xPosition} ${yPosition}`
  }

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

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="text-center mb-3">
          <h3 className="text-lg font-medium text-teal-700">ASL Sign for:</h3>
          <p className="text-xl font-bold">{word}</p>
        </div>

        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: getWordColor(word) + "20" }} // Light background based on word
        >
          {renderWordVisual()}
        </div>
      </div>

      <div className="text-sm text-gray-500 text-center max-w-md">
        <p>This shows the ASL finger spelling for "{word}"</p>
        <p className="mt-1">Each hand position represents a letter in the word.</p>
      </div>
    </div>
  )
}
