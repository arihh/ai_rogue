// Game logic hook for Agentダンジョン

import { useState, useCallback } from 'react';
import { GameState, GameAction, Direction } from '../types/game';
import {
  generateDungeon,
  generateEnemies,
  generateItems,
  getValidSpawnPositions,
  createPlayer,
  isValidMove,
  getNewPosition,
  positionsEqual
} from '../utils/gameUtils';

const initialGameState: GameState = {
  currentScene: 'title',
  player: createPlayer({ x: 1, y: 1 }),
  enemies: [],
  items: [],
  dungeon: [],
  dungeonLevel: 1,
  score: 0,
  gameMessage: 'Welcome to Agentダンジョン!'
};

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const initializeGame = useCallback(() => {
    const dungeon = generateDungeon(1);
    const validPositions = getValidSpawnPositions(dungeon);
    
    if (validPositions.length === 0) {
      console.error('No valid spawn positions found!');
      return;
    }

    const player = createPlayer(validPositions[0]);
    const enemies = generateEnemies(1, validPositions);
    const items = generateItems(1, validPositions);

    setGameState({
      currentScene: 'game',
      player,
      enemies,
      items,
      dungeon,
      dungeonLevel: 1,
      score: 0,
      gameMessage: 'Explore the dungeon!'
    });
  }, []);

  const nextLevel = useCallback(() => {
    const nextLevelNum = gameState.dungeonLevel + 1;
    const dungeon = generateDungeon(nextLevelNum);
    const validPositions = getValidSpawnPositions(dungeon);
    
    if (validPositions.length === 0) {
      setGameState(prev => ({ 
        ...prev, 
        gameMessage: 'Error: Could not generate next level!' 
      }));
      return;
    }

    const enemies = generateEnemies(nextLevelNum, validPositions);
    const items = generateItems(nextLevelNum, validPositions);

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        position: validPositions[0],
        health: Math.min(prev.player.health + 2, prev.player.maxHealth + 2),
        maxHealth: prev.player.maxHealth + 2
      },
      enemies,
      items,
      dungeon,
      dungeonLevel: nextLevelNum,
      gameMessage: `Level ${nextLevelNum}! Your health has been restored.`
    }));
  }, [gameState.dungeonLevel]);

  const movePlayer = useCallback((direction: Direction) => {
    setGameState(prev => {
      const newPosition = getNewPosition(prev.player.position, direction);
      
      if (!isValidMove(prev.dungeon, newPosition)) {
        return { ...prev, gameMessage: 'Cannot move there!' };
      }

      // Check for enemy collision
      const enemyAtPosition = prev.enemies.find(enemy => 
        positionsEqual(enemy.position, newPosition)
      );

      if (enemyAtPosition) {
        return { ...prev, gameMessage: 'There\'s an enemy in the way!' };
      }

      // Check if reaching goal
      const cell = prev.dungeon[newPosition.y]?.[newPosition.x];
      if (cell?.type === 'goal') {
        const bonusScore = prev.dungeonLevel * 100;
        return {
          ...prev,
          player: { ...prev.player, position: newPosition },
          score: prev.score + bonusScore,
          currentScene: 'victory',
          gameMessage: `Level ${prev.dungeonLevel} completed! +${bonusScore} points!`
        };
      }

      // Check for item pickup
      const itemAtPosition = prev.items.find(item => 
        positionsEqual(item.position, newPosition)
      );

      const newPlayer = { ...prev.player, position: newPosition };
      let newItems = prev.items;
      let message = '';
      let newScore = prev.score;

      if (itemAtPosition) {
        newItems = prev.items.filter(item => item.id !== itemAtPosition.id);
        
        switch (itemAtPosition.type) {
          case 'health':
            newPlayer.health = Math.min(newPlayer.health + itemAtPosition.value, newPlayer.maxHealth);
            message = `Gained ${itemAtPosition.value} health!`;
            break;
          case 'weapon':
            newPlayer.attack += itemAtPosition.value;
            message = `Attack increased by ${itemAtPosition.value}!`;
            break;
          case 'treasure':
            newScore += itemAtPosition.value;
            message = `Found treasure! +${itemAtPosition.value} points!`;
            break;
        }
      }

      return {
        ...prev,
        player: newPlayer,
        items: newItems,
        score: newScore,
        gameMessage: message || 'Moved successfully.'
      };
    });
  }, []);

  const attackEnemy = useCallback((direction: Direction) => {
    setGameState(prev => {
      const attackPosition = getNewPosition(prev.player.position, direction);
      const enemyToAttack = prev.enemies.find(enemy => 
        positionsEqual(enemy.position, attackPosition)
      );

      if (!enemyToAttack) {
        return { ...prev, gameMessage: 'No enemy to attack in that direction!' };
      }

      const newEnemyHealth = enemyToAttack.health - prev.player.attack;
      let newEnemies = prev.enemies;
      let newScore = prev.score;
      const newPlayer = { ...prev.player };
      let message = `Attacked ${enemyToAttack.name} for ${prev.player.attack} damage!`;

      if (newEnemyHealth <= 0) {
        // Enemy defeated
        newEnemies = prev.enemies.filter(enemy => enemy.id !== enemyToAttack.id);
        newScore += enemyToAttack.reward;
        newPlayer.experience += enemyToAttack.reward;
        message = `Defeated ${enemyToAttack.name}! +${enemyToAttack.reward} points!`;

        // Level up check
        const expRequired = newPlayer.level * 50;
        if (newPlayer.experience >= expRequired) {
          newPlayer.level += 1;
          newPlayer.maxHealth += 3;
          newPlayer.health = newPlayer.maxHealth;
          newPlayer.attack += 1;
          newPlayer.experience -= expRequired;
          message += ` Level up! Now level ${newPlayer.level}!`;
        }
      } else {
        // Update enemy health
        newEnemies = prev.enemies.map(enemy => 
          enemy.id === enemyToAttack.id 
            ? { ...enemy, health: newEnemyHealth }
            : enemy
        );
      }

      // Enemy counter-attack
      if (newEnemyHealth > 0) {
        newPlayer.health -= enemyToAttack.attack;
        message += ` ${enemyToAttack.name} attacks back for ${enemyToAttack.attack} damage!`;

        if (newPlayer.health <= 0) {
          return {
            ...prev,
            player: newPlayer,
            currentScene: 'gameOver',
            gameMessage: 'You have been defeated!'
          };
        }
      }

      return {
        ...prev,
        player: newPlayer,
        enemies: newEnemies,
        score: newScore,
        gameMessage: message
      };
    });
  }, []);

  const performAction = useCallback((action: GameAction) => {
    switch (action.type) {
      case 'move':
        if (action.direction) {
          movePlayer(action.direction);
        }
        break;
      case 'attack':
        if (action.direction) {
          attackEnemy(action.direction);
        }
        break;
      case 'nextLevel':
        nextLevel();
        break;
      case 'restart':
        setGameState(initialGameState);
        break;
      case 'changeScene':
        if (action.scene) {
          setGameState(prev => ({ ...prev, currentScene: action.scene! }));
        }
        break;
    }
  }, [movePlayer, attackEnemy, nextLevel]);

  return {
    gameState,
    performAction,
    initializeGame
  };
}