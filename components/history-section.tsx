"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Translation } from "@/types/translation"
import { Clock, Trash2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface HistorySectionProps {
  history: Translation[]
  onSelect: (translation: Translation) => void
  onClear: () => void
}

export default function HistorySection({ history, onSelect, onClear }: HistorySectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-teal-700 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Translations
        </h2>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear translation history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your recent translations. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClear} className="bg-red-500 hover:bg-red-600">
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {history.length === 0 ? (
        <Card className="border-2 border-teal-100">
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            <AlertTriangle className="h-12 w-12 text-teal-200 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No history yet</h3>
            <p className="text-gray-500 max-w-md">
              Your recent translations will appear here. Start by translating a phrase in the Translate tab!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => (
            <Card
              key={item.id}
              className="border-2 border-teal-100 hover:border-teal-300 transition-colors cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium line-clamp-1">{item.originalText}</CardTitle>
                <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {item.words.map((word, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${
                        word.hasSign ? "bg-teal-100 text-teal-700" : "bg-cyan-100 text-cyan-700"
                      }`}
                    >
                      {word.original}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
