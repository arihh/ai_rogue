// Game Over Screen Component for Agentダンジョン

interface GameOverScreenProps {
  score: number;
  level: number;
  onRestart: () => void;
  onBackToTitle: () => void;
}

export function GameOverScreen({ score, level, onRestart, onBackToTitle }: GameOverScreenProps) {
  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h1 className="game-over-title">
          💀 Game Over
        </h1>
        
        <div className="final-stats">
          <div className="stat-line">
            <span className="stat-icon">🏆</span>
            <span className="stat-text">Final Score: {score.toLocaleString()}</span>
          </div>
          <div className="stat-line">
            <span className="stat-icon">🏰</span>
            <span className="stat-text">Reached Floor: {level}</span>
          </div>
        </div>
        
        <div className="game-over-message">
          <p>Your adventure has come to an end!</p>
          <p>But every ending is a new beginning...</p>
        </div>
        
        <div className="game-over-buttons">
          <button 
            className="restart-button"
            onClick={onRestart}
          >
            🔄 Try Again
          </button>
          <button 
            className="title-button"
            onClick={onBackToTitle}
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}