// Game utility functions for Agentダンジョン

import { Position, DungeonCell, Player, Enemy, Item, Direction } from '../types/game';

export const DUNGEON_WIDTH = 15;
export const DUNGEON_HEIGHT = 15;

// Generate a simple random dungeon
export function generateDungeon(level: number): DungeonCell[][] {
  const dungeon: DungeonCell[][] = [];
  
  // Initialize with walls
  for (let y = 0; y < DUNGEON_HEIGHT; y++) {
    dungeon[y] = [];
    for (let x = 0; x < DUNGEON_WIDTH; x++) {
      dungeon[y][x] = {
        type: 'wall',
        position: { x, y }
      };
    }
  }

  // Create rooms and corridors
  const rooms = generateRooms(level);
  
  // Carve out rooms
  rooms.forEach(room => {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (x >= 0 && x < DUNGEON_WIDTH && y >= 0 && y < DUNGEON_HEIGHT) {
          dungeon[y][x].type = 'floor';
        }
      }
    }
  });

  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const room1 = rooms[i];
    const room2 = rooms[i + 1];
    createCorridor(dungeon, 
      { x: Math.floor(room1.x + room1.width / 2), y: Math.floor(room1.y + room1.height / 2) },
      { x: Math.floor(room2.x + room2.width / 2), y: Math.floor(room2.y + room2.height / 2) }
    );
  }

  // Place goal in the last room
  const lastRoom = rooms[rooms.length - 1];
  const goalX = lastRoom.x + Math.floor(lastRoom.width / 2);
  const goalY = lastRoom.y + Math.floor(lastRoom.height / 2);
  if (goalX < DUNGEON_WIDTH && goalY < DUNGEON_HEIGHT) {
    dungeon[goalY][goalX].type = 'goal';
  }

  return dungeon;
}

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

function generateRooms(level: number): Room[] {
  const rooms: Room[] = [];
  const numRooms = Math.min(3 + level, 8);

  for (let i = 0; i < numRooms; i++) {
    const width = 3 + Math.floor(Math.random() * 4);
    const height = 3 + Math.floor(Math.random() * 4);
    const x = 1 + Math.floor(Math.random() * (DUNGEON_WIDTH - width - 2));
    const y = 1 + Math.floor(Math.random() * (DUNGEON_HEIGHT - height - 2));

    // Check for overlap
    const overlaps = rooms.some(room => 
      x < room.x + room.width + 1 && x + width + 1 > room.x &&
      y < room.y + room.height + 1 && y + height + 1 > room.y
    );

    if (!overlaps) {
      rooms.push({ x, y, width, height });
    }
  }

  return rooms;
}

function createCorridor(dungeon: DungeonCell[][], start: Position, end: Position): void {
  const current = { ...start };

  // Move horizontally first
  while (current.x !== end.x) {
    if (current.x >= 0 && current.x < DUNGEON_WIDTH && current.y >= 0 && current.y < DUNGEON_HEIGHT) {
      dungeon[current.y][current.x].type = 'floor';
    }
    current.x += current.x < end.x ? 1 : -1;
  }

  // Then move vertically
  while (current.y !== end.y) {
    if (current.x >= 0 && current.x < DUNGEON_WIDTH && current.y >= 0 && current.y < DUNGEON_HEIGHT) {
      dungeon[current.y][current.x].type = 'floor';
    }
    current.y += current.y < end.y ? 1 : -1;
  }
}

// Find valid spawn positions in the dungeon
export function getValidSpawnPositions(dungeon: DungeonCell[][]): Position[] {
  const positions: Position[] = [];
  
  for (let y = 0; y < DUNGEON_HEIGHT; y++) {
    for (let x = 0; x < DUNGEON_WIDTH; x++) {
      if (dungeon[y][x].type === 'floor') {
        positions.push({ x, y });
      }
    }
  }
  
  return positions;
}

// Generate enemies for the level
export function generateEnemies(level: number, validPositions: Position[]): Enemy[] {
  const enemies: Enemy[] = [];
  const numEnemies = Math.min(level + 2, 8);
  const enemyTypes = ['👹', '🐺', '🐲', '👻', '🦇'];
  const enemyNames = ['Goblin', 'Wolf', 'Dragon', 'Ghost', 'Bat'];

  for (let i = 0; i < numEnemies && i < validPositions.length - 1; i++) {
    const position = validPositions[i + 1]; // Skip first position for player
    const typeIndex = Math.floor(Math.random() * enemyTypes.length);
    
    enemies.push({
      id: `enemy-${i}`,
      position: { ...position },
      symbol: enemyTypes[typeIndex],
      name: enemyNames[typeIndex],
      health: 2 + level,
      maxHealth: 2 + level,
      attack: 1 + Math.floor(level / 2),
      reward: 10 * level
    });
  }

  return enemies;
}

// Generate items for the level
export function generateItems(level: number, validPositions: Position[]): Item[] {
  const items: Item[] = [];
  const numItems = Math.min(level + 1, 5);

  for (let i = 0; i < numItems && i < validPositions.length - 10; i++) {
    const position = validPositions[i + 10]; // Use later positions for items
    const itemType = Math.random() < 0.4 ? 'health' : Math.random() < 0.7 ? 'weapon' : 'treasure';
    
    let symbol: string;
    let value: number;
    
    switch (itemType) {
      case 'health':
        symbol = '❤️';
        value = 2 + level;
        break;
      case 'weapon':
        symbol = '⚔️';
        value = 1 + Math.floor(level / 2);
        break;
      case 'treasure':
        symbol = '💎';
        value = 50 * level;
        break;
    }

    items.push({
      id: `item-${i}`,
      position: { ...position },
      symbol,
      name: itemType.charAt(0).toUpperCase() + itemType.slice(1),
      type: itemType,
      value
    });
  }

  return items;
}

// Check if a position is valid for movement
export function isValidMove(dungeon: DungeonCell[][], position: Position): boolean {
  if (position.x < 0 || position.x >= DUNGEON_WIDTH || position.y < 0 || position.y >= DUNGEON_HEIGHT) {
    return false;
  }
  
  const cell = dungeon[position.y][position.x];
  return cell.type === 'floor' || cell.type === 'goal';
}

// Get new position based on direction
export function getNewPosition(position: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':
      return { x: position.x, y: position.y - 1 };
    case 'down':
      return { x: position.x, y: position.y + 1 };
    case 'left':
      return { x: position.x - 1, y: position.y };
    case 'right':
      return { x: position.x + 1, y: position.y };
  }
}

// Check if two positions are the same
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

// Create initial player
export function createPlayer(position: Position): Player {
  return {
    id: 'player',
    position: { ...position },
    symbol: '🤖',
    name: 'Agent',
    health: 10,
    maxHealth: 10,
    attack: 2,
    level: 1,
    experience: 0
  };
}