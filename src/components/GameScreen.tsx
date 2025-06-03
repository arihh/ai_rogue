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
            <h2>🎉 Level Complete!</h2>
            <p>Score: {gameState.score}</p>
            <button 
              className="next-level-button"
              onClick={onNextLevel}
            >
              ⬆️ Next Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
}