interface AlphabetDisplayProps {
  letter: string
}

export default function AlphabetDisplay({ letter }: AlphabetDisplayProps) {
  // Convert letter to uppercase and get its ASCII code
  const upperLetter = letter.toUpperCase()
  const letterCode = upperLetter.charCodeAt(0)

  // Only process if it's a letter A-Z
  if (letterCode < 65 || letterCode > 90) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
        <span className="text-gray-400">?</span>
      </div>
    )
  }

  // Calculate the position in the alphabet (0-25)
  const alphabetPosition = letterCode - 65

  // Calculate row and column for positioning
  // The image has 4 rows with 7, 7, 7, and 5 letters respectively
  let row = 0
  let col = 0

  if (alphabetPosition < 7) {
    row = 0
    col = alphabetPosition
  } else if (alphabetPosition < 14) {
    row = 1
    col = alphabetPosition - 7
  } else if (alphabetPosition < 21) {
    row = 2
    col = alphabetPosition - 14
  } else {
    row = 3
    col = alphabetPosition - 21
  }

  // Calculate percentage positions for object-position
  // Each letter takes approximately 1/7 of the width (about 14.3%)
  // Each row takes 1/4 of the height (25%)
  const xPosition = `${col * 14.3}%`
  const yPosition = `${row * 25}%`

  return (
    <div className="relative w-full h-full overflow-hidden rounded-full">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/images/asl-alphabet.jpeg')`,
          backgroundPosition: `${xPosition} ${yPosition}`,
          backgroundSize: "700%",
          transform: "scale(1.2)",
        }}
      />
    </div>
  )
}
