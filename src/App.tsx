import { useGameLogic } from './hooks/useGameLogic';
import { TitleScreen, GameScreen, GameOverScreen } from './components';
import { Direction } from './types/game';
import './App.css'

function App() {
  const { gameState, performAction, initializeGame } = useGameLogic();

  const handleStartGame = () => {
    initializeGame();
  };

  const handleMove = (direction: Direction) => {
    performAction({ type: 'move', direction });
  };

  const handleAttack = (direction: Direction) => {
    performAction({ type: 'attack', direction });
  };

  const handleNextLevel = () => {
    performAction({ type: 'nextLevel' });
  };

  const handleRestart = () => {
    initializeGame();
  };

  const handleBackToTitle = () => {
    performAction({ type: 'changeScene', scene: 'title' });
  };

  const renderCurrentScene = () => {
    switch (gameState.currentScene) {
      case 'title':
        return <TitleScreen onStartGame={handleStartGame} />;
      
      case 'game':
      case 'victory':
        return (
          <GameScreen
            gameState={gameState}
            onMove={handleMove}
            onAttack={handleAttack}
            onNextLevel={handleNextLevel}
          />
        );
      
      case 'gameOver':
        return (
          <GameOverScreen
            score={gameState.score}
            level={gameState.dungeonLevel}
            onRestart={handleRestart}
            onBackToTitle={handleBackToTitle}
          />
        );
      
      default:
        return <TitleScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentScene()}
    </div>
  );
}

export default App
