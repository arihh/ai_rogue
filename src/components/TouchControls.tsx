// Touch Controls Component for Agentダンジョン

import { useState } from 'react';
import { Direction } from '../types/game';

interface TouchControlsProps {
  onMove: (direction: Direction) => void;
  onAttack: (direction: Direction) => void;
}

export function TouchControls({ onMove, onAttack }: TouchControlsProps) {
  const [isAttackMode, setIsAttackMode] = useState(false);

  const handleDirectionPress = (direction: Direction) => {
    if (isAttackMode) {
      onAttack(direction);
      setIsAttackMode(false);
    } else {
      onMove(direction);
    }
  };

  return (
    <div className="touch-controls">
      <div className="control-mode">
        <button 
          className={`mode-button ${!isAttackMode ? 'active' : ''}`}
          onClick={() => setIsAttackMode(false)}
        >
          🚶 移動
        </button>
        <button 
          className={`mode-button ${isAttackMode ? 'active' : ''}`}
          onClick={() => setIsAttackMode(true)}
        >
          ⚔️ 攻撃
        </button>
      </div>
      
      <div className="direction-pad">
        <div className="direction-row">
          <div className="direction-spacer"></div>
          <button 
            className="direction-button up"
            onClick={() => handleDirectionPress('up')}
            onTouchStart={(e) => e.preventDefault()}
          >
            ⬆️
          </button>
          <div className="direction-spacer"></div>
        </div>
        
        <div className="direction-row">
          <button 
            className="direction-button left"
            onClick={() => handleDirectionPress('left')}
            onTouchStart={(e) => e.preventDefault()}
          >
            ⬅️
          </button>
          <div className="direction-center">
            {isAttackMode ? '⚔️' : '🎮'}
          </div>
          <button 
            className="direction-button right"
            onClick={() => handleDirectionPress('right')}
            onTouchStart={(e) => e.preventDefault()}
          >
            ➡️
          </button>
        </div>
        
        <div className="direction-row">
          <div className="direction-spacer"></div>
          <button 
            className="direction-button down"
            onClick={() => handleDirectionPress('down')}
            onTouchStart={(e) => e.preventDefault()}
          >
            ⬇️
          </button>
          <div className="direction-spacer"></div>
        </div>
      </div>
    </div>
  );
}