import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Create a directory for the ASL alphabet images if it doesn't exist
const aslAlphabetDir = path.join(process.cwd(), "public/images/asl_alphabet")
if (!fs.existsSync(aslAlphabetDir)) {
  fs.mkdirSync(aslAlphabetDir, { recursive: true })
}

// Create a space image if it doesn't exist
const spaceImagePath = path.join(aslAlphabetDir, "space_test.jpg")
if (!fs.existsSync(spaceImagePath)) {
  try {
    // We'll just use a placeholder for space since we can't create an image on the fly
    console.log("Space image doesn't exist, will use placeholder")
  } catch (error) {
    console.error("Error handling space image:", error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    console.log("Processing text:", text)

    // Process the text using simplified logic
    const letters = text.toLowerCase().split("")
    const result = letters.map((letter) => {
      if (letter === " ") {
        return {
          char: letter,
          type: "space",
          imagePath: "/placeholder.svg?height=200&width=200&text=Space",
        }
      } else if (/[a-z]/.test(letter)) {
        // For letters, we'll check if we have the image, but not fail if we don't
        const imagePath = `/images/asl_alphabet/${letter}_test.jpg`

        // We don't need to check if the file exists here since we're in an API route
        // The frontend will handle missing images gracefully
        return {
          char: letter,
          type: "letter",
          imagePath,
        }
      } else {
        return {
          char: letter,
          type: "unsupported",
          imagePath: `/placeholder.svg?height=200&width=200&text=${letter}`,
        }
      }
    })

    console.log("Processed result:", result)
    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error in transcribe API:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
