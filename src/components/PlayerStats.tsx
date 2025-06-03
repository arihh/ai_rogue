// Player Stats Component for Agentダンジョン

import { Player } from '../types/game';

interface PlayerStatsProps {
  player: Player;
  score: number;
  level: number;
}

export function PlayerStats({ player, score, level }: PlayerStatsProps) {
  const healthPercentage = (player.health / player.maxHealth) * 100;
  const expRequired = player.level * 50;
  const expPercentage = (player.experience / expRequired) * 100;

  return (
    <div className="player-stats">
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">🤖 Agent</span>
          <span className="stat-value">Lv.{player.level}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">❤️ Health</span>
          <div className="health-bar">
            <div 
              className="health-fill"
              style={{ width: `${healthPercentage}%` }}
            />
            <span className="health-text">
              {player.health}/{player.maxHealth}
            </span>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">⚔️ Attack</span>
          <span className="stat-value">{player.attack}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">✨ EXP</span>
          <div className="exp-bar">
            <div 
              className="exp-fill"
              style={{ width: `${expPercentage}%` }}
            />
            <span className="exp-text">
              {player.experience}/{expRequired}
            </span>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">🏆 Score</span>
          <span className="stat-value">{score.toLocaleString()}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">🏰 Floor</span>
          <span className="stat-value">{level}</span>
        </div>
      </div>
    </div>
  );
}