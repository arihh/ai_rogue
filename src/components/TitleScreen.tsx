// Title Screen Component for Agentダンジョン

interface TitleScreenProps {
  onStartGame: () => void;
}

export function TitleScreen({ onStartGame }: TitleScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-content">
        <h1 className="game-title">
          <span className="title-icon">🤖</span>
          Agentダンジョン
        </h1>
        <p className="game-subtitle">
          ファンタジーローグライクアドベンチャー
        </p>
        <div className="title-description">
          <p>🏰 ランダム生成されたダンジョンを探索</p>
          <p>⚔️ モンスターと戦い、宝を集める</p>
          <p>🎯 ゴールに到達してレベルを進める</p>
        </div>
        <button 
          className="start-button"
          onClick={onStartGame}
        >
          🚀 冒険を始める
        </button>
        <div className="controls-info">
          <h3>📱 タッチ操作</h3>
          <p>方向ボタンで移動・攻撃します</p>
        </div>
      </div>
    </div>
  );
}