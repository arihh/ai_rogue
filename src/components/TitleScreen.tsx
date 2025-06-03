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
          Fantasy Roguelike Adventure
        </p>
        <div className="title-description">
          <p>🏰 Explore randomly generated dungeons</p>
          <p>⚔️ Fight monsters and collect treasures</p>
          <p>🎯 Reach the goal to advance levels</p>
        </div>
        <button 
          className="start-button"
          onClick={onStartGame}
        >
          🚀 Start Adventure
        </button>
        <div className="controls-info">
          <h3>📱 Touch Controls</h3>
          <p>Use directional buttons to move and attack</p>
        </div>
      </div>
    </div>
  );
}