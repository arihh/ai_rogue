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
  gameMessage: 'Agentダンジョンへようこそ！'
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
      gameMessage: 'ダンジョンを探索しよう！'
    });
  }, []);

  const nextLevel = useCallback(() => {
    const nextLevelNum = gameState.dungeonLevel + 1;
    const dungeon = generateDungeon(nextLevelNum);
    const validPositions = getValidSpawnPositions(dungeon);
    
    if (validPositions.length === 0) {
      setGameState(prev => ({ 
        ...prev, 
        gameMessage: 'エラー：次のレベルを生成できませんでした！' 
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
      gameMessage: `レベル${nextLevelNum}！体力が回復しました。`
    }));
  }, [gameState.dungeonLevel]);

  const movePlayer = useCallback((direction: Direction) => {
    setGameState(prev => {
      const newPosition = getNewPosition(prev.player.position, direction);
      
      if (!isValidMove(prev.dungeon, newPosition)) {
        return { ...prev, gameMessage: 'そこには移動できません！' };
      }

      // Check for enemy collision
      const enemyAtPosition = prev.enemies.find(enemy => 
        positionsEqual(enemy.position, newPosition)
      );

      if (enemyAtPosition) {
        return { ...prev, gameMessage: '敵がいて通れません！' };
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
          gameMessage: `レベル${prev.dungeonLevel}クリア！+${bonusScore}点！`
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
            message = `体力が${itemAtPosition.value}回復！`;
            break;
          case 'weapon':
            newPlayer.attack += itemAtPosition.value;
            message = `攻撃力が${itemAtPosition.value}上昇！`;
            break;
          case 'treasure':
            newScore += itemAtPosition.value;
            message = `宝を発見！+${itemAtPosition.value}点！`;
            break;
        }
      }

      return {
        ...prev,
        player: newPlayer,
        items: newItems,
        score: newScore,
        gameMessage: message || '移動しました。'
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
        return { ...prev, gameMessage: 'その方向に攻撃できる敵がいません！' };
      }

      const newEnemyHealth = enemyToAttack.health - prev.player.attack;
      let newEnemies = prev.enemies;
      let newScore = prev.score;
      const newPlayer = { ...prev.player };
      let message = `${enemyToAttack.name}に${prev.player.attack}ダメージを与えた！`;

      if (newEnemyHealth <= 0) {
        // Enemy defeated
        newEnemies = prev.enemies.filter(enemy => enemy.id !== enemyToAttack.id);
        newScore += enemyToAttack.reward;
        newPlayer.experience += enemyToAttack.reward;
        message = `${enemyToAttack.name}を倒した！+${enemyToAttack.reward}点！`;

        // Level up check
        const expRequired = newPlayer.level * 50;
        if (newPlayer.experience >= expRequired) {
          newPlayer.level += 1;
          newPlayer.maxHealth += 3;
          newPlayer.health = newPlayer.maxHealth;
          newPlayer.attack += 1;
          newPlayer.experience -= expRequired;
          message += ` レベルアップ！現在レベル${newPlayer.level}！`;
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
        message += ` ${enemyToAttack.name}の反撃！${enemyToAttack.attack}ダメージ！`;

        if (newPlayer.health <= 0) {
          return {
            ...prev,
            player: newPlayer,
            currentScene: 'gameOver',
            gameMessage: 'あなたは倒れてしまった！'
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