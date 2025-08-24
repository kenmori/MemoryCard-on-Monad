import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MemoryGame from './components/MemoryGame';

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const startGame = () => {
    setGameState('playing');
    setLevel(1);
    setTotalScore(0);
  };

  const handleLevelComplete = (levelScore) => {
    const newTotalScore = totalScore + levelScore;
    setTotalScore(newTotalScore);
    
    if (newTotalScore > bestScore) {
      setBestScore(newTotalScore);
    }
    
    setLevel(prev => prev + 1);
  };

  const handleScoreUpdate = (currentLevelScore) => {
    // スコア更新の処理（必要に応じて）
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  if (gameState === 'playing') {
    return (
      <div className="container">
        <div className="game-header">
          <h1 className="game-title">Monad Memory Game</h1>
          <button 
            className="back-button" 
            onClick={backToMenu}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            メニューに戻る
          </button>
        </div>
        
        <div className="game-stats">
          <div className="stat">
            <div className="stat-label">Level</div>
            <div className="stat-value">{level}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Total Score</div>
            <div className="stat-value">{totalScore}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Best</div>
            <div className="stat-value">{bestScore}</div>
          </div>
        </div>

        <MemoryGame 
          level={level}
          onLevelComplete={handleLevelComplete}
          onScoreUpdate={handleScoreUpdate}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="game-header">
        <h1 className="game-title">Monad Memory Game</h1>
        <div className="wallet-section">
          <h2 className="wallet-title">Connect Your Wallet</h2>
          <ConnectButton />
        </div>
      </div>
      
      <div className="game-stats">
        <div className="stat">
          <div className="stat-label">Level</div>
          <div className="stat-value">{level}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Score</div>
          <div className="stat-value">{totalScore}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Best</div>
          <div className="stat-value">{bestScore}</div>
        </div>
      </div>

      <button className="start-button" onClick={startGame}>
        Start Game
      </button>
    </div>
  );
}

export default App;