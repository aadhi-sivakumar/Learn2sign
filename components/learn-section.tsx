"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function LearnSection() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-teal-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-teal-700 mb-2">ASL Alphabet Reference</h3>
            <div className="relative w-full max-w-2xl mx-auto">
              <img
                src="/images/asl-alphabet.jpeg"
                alt="ASL Alphabet Reference Chart"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
