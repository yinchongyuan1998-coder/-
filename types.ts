
export interface PuzzleLogic {
  answer: string;
  clueWord: string;
  imagePrompt: string;
  analysis: string;
}

export interface GenerationResult {
  imageUrl: string;
  logic: PuzzleLogic;
}
