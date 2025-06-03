// Game types and interfaces for Agentダンジョン

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Position;
  symbol: string;
  name: string;
}

export interface Player extends Entity {
  health: number;
  maxHealth: number;
  attack: number;
  level: number;
  experience: number;
}

export interface Enemy extends Entity {
  health: number;
  maxHealth: number;
  attack: number;
  reward: number;
}

export interface Item extends Entity {
  type: 'health' | 'weapon' | 'treasure';
  value: number;
}

export interface DungeonCell {
  type: 'wall' | 'floor' | 'door' | 'goal';
  position: Position;
}

export interface GameState {
  currentScene: 'title' | 'game' | 'gameOver' | 'victory';
  player: Player;
  enemies: Enemy[];
  items: Item[];
  dungeon: DungeonCell[][];
  dungeonLevel: number;
  score: number;
  gameMessage: string;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameAction {
  type: 'move' | 'attack' | 'pickupItem' | 'nextLevel' | 'restart' | 'changeScene';
  direction?: Direction;
  targetId?: string;
  scene?: GameState['currentScene'];
}