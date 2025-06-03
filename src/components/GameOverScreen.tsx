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
          💀 ゲームオーバー
        </h1>
        
        <div className="final-stats">
          <div className="stat-line">
            <span className="stat-icon">🏆</span>
            <span className="stat-text">最終スコア: {score.toLocaleString()}</span>
          </div>
          <div className="stat-line">
            <span className="stat-icon">🏰</span>
            <span className="stat-text">到達階層: {level}</span>
          </div>
        </div>
        
        <div className="game-over-message">
          <p>冒険はここで終わりです！</p>
          <p>しかし、終わりは新たな始まり…</p>
        </div>
        
        <div className="game-over-buttons">
          <button 
            className="restart-button"
            onClick={onRestart}
          >
            🔄 もう一度挑戦
          </button>
          <button 
            className="title-button"
            onClick={onBackToTitle}
          >
            🏠 メインメニュー
          </button>
        </div>
      </div>
    </div>
  );
}