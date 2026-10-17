export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

export type IngredientIconId =
  | 'dragon-tears'
  | 'fairy-dust'
  | 'frost-lotus'
  | 'mandrake-root'
  | 'caustic-acid'
  | 'essence-of-the-void'
  | 'phoenix-feather'
  | 'toad-slime';

export interface IIngredient {
  id: string;
  name: string;
  icon: IngredientIconId;
  temperature: number;
  density: number;
  magicPower: number;
}

export interface IRecipeRange {
  min: number;
  max: number;
}

export interface IRecipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}

export interface IGameState {
  status: GameStatus;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe | null;
  cauldronIngredients: IIngredient[];
  shelfStock: Record<string, number>;
  difficulty: Difficulty;
  lastReactionId?: string | null;
}

export interface IDifficultyConfig {
  shelfIngredientCount: number;
  maxCauldronIngredients: number;
  startingTime: number;
  recipeTolerance: number;
  lives: number;
  scorePerBrew: number;
  timeBonusPerBrew: number;
  reactionCount: number;
}
