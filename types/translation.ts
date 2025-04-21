export interface WordInfo {
  original: string
  hasSign: boolean // Whether the word has a direct sign or needs fingerspelling
}

export interface Translation {
  id: string
  originalText: string
  timestamp: string
  words: WordInfo[]
}
