import { ConnectButton } from '@rainbow-me/rainbowkit';

function App() {
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
          <div className="stat-value">1</div>
        </div>
        <div className="stat">
          <div className="stat-label">Score</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat">
          <div className="stat-label">Best</div>
          <div className="stat-value">0</div>
        </div>
      </div>

      <button className="start-button">
        Start Game
      </button>
    </div>
  );
}

export default App;