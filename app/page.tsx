"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, History, Search, Sparkles } from "lucide-react"
import TranslationDisplay from "@/components/translation-display"
import HistorySection from "@/components/history-section"
import LearnSection from "@/components/learn-section"
import type { Translation } from "@/types/translation"

export default function Home() {
  const [inputText, setInputText] = useState("")
  const [currentTranslation, setCurrentTranslation] = useState<Translation | null>(null)
  const [history, setHistory] = useState<Translation[]>([])
  const [activeTab, setActiveTab] = useState("translate")
  const [isTranslating, setIsTranslating] = useState(false)

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem("translation-history")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Error parsing saved history:", e)
        localStorage.removeItem("translation-history")
      }
    }
  }, [])

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("translation-history", JSON.stringify(history))
  }, [history])

  const handleTranslate = () => {
    if (!inputText.trim() || isTranslating) return

    setIsTranslating(true)

    try {
      // Create a new translation
      const newTranslation: Translation = {
        id: Date.now().toString(),
        originalText: inputText,
        timestamp: new Date().toISOString(),
        words: inputText.split(/\s+/).map((word) => ({
          original: word,
          hasSign: true, // We're assuming all words can be finger-spelled
        })),
      }

      // Update current translation and add to history
      setCurrentTranslation(newTranslation)
      setHistory((prev) => [newTranslation, ...prev].slice(0, 20)) // Keep only the 20 most recent
      setInputText("")
    } catch (error) {
      console.error("Error during translation:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <img src="/images/asl-hand-logo.png" alt="ASL Hand Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
              Sign-opsis
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Translate English text into American Sign Language (ASL) and learn sign language in a fun, interactive way!
          </p>
        </header>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8 bg-gradient-to-r from-teal-100 to-cyan-100">
            <TabsTrigger
              value="translate"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-200 data-[state=active]:to-cyan-200"
            >
              <Sparkles className="h-4 w-4" />
              <span>Translate</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-200 data-[state=active]:to-cyan-200"
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger
              value="learn"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-200 data-[state=active]:to-cyan-200"
            >
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </TabsTrigger>
          </TabsList>

          {/* Translation Tab */}
          <TabsContent value="translate" className="space-y-6">
            <Card className="border-2 border-teal-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter text to translate to ASL..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTranslate()}
                    className="border-2 border-teal-200 focus-visible:ring-teal-400"
                    disabled={isTranslating}
                  />
                  <Button
                    onClick={handleTranslate}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                    disabled={isTranslating}
                  >
                    {isTranslating ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Translate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {currentTranslation && <TranslationDisplay translation={currentTranslation} />}

            {!currentTranslation && (
              <div className="text-center py-12">
                <img src="/images/asl-hand-logo.png" alt="ASL Hand Logo" className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">Ready to translate!</h3>
                <p className="text-gray-500">Type a word or phrase above and click translate to see it in ASL</p>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <HistorySection
              history={history}
              onSelect={(translation) => {
                setCurrentTranslation(translation)
                setActiveTab("translate")
              }}
              onClear={() => setHistory([])}
            />
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn">
            <LearnSection />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 bg-gradient-to-r from-teal-100 to-cyan-100 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Sign-opsis • Learn ASL with fun and ease</p>
      </footer>
    </main>
  )
}
