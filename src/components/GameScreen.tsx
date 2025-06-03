// Game Screen Component for Agentダンジョン

import { GameState, Direction } from '../types/game';
import { DungeonView } from './DungeonView';
import { PlayerStats } from './PlayerStats';
import { TouchControls } from './TouchControls';

interface GameScreenProps {
  gameState: GameState;
  onMove: (direction: Direction) => void;
  onAttack: (direction: Direction) => void;
  onNextLevel: () => void;
}

export function GameScreen({ gameState, onMove, onAttack, onNextLevel }: GameScreenProps) {
  return (
    <div className="game-screen">
      <PlayerStats player={gameState.player} score={gameState.score} level={gameState.dungeonLevel} />
      
      <div className="game-message">
        {gameState.gameMessage}
      </div>
      
      <DungeonView 
        dungeon={gameState.dungeon}
        player={gameState.player}
        enemies={gameState.enemies}
        items={gameState.items}
      />
      
      <TouchControls 
        onMove={onMove}
        onAttack={onAttack}
      />
      
      {gameState.currentScene === 'victory' && (
        <div className="victory-overlay">
          <div className="victory-content">
            <h2>🎉 レベルクリア！</h2>
            <p>スコア: {gameState.score}</p>
            <button 
              className="next-level-button"
              onClick={onNextLevel}
            >
              ⬆️ 次のレベルへ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}