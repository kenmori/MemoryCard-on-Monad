import { useMemoryGameContract } from '../hooks/useMemoryGameContract';

function Leaderboard({ isOpen, onClose }) {
  const { leaderboard, isConnected } = useMemoryGameContract();

  if (!isOpen) return null;

  const formatAddress = (address) => {
    if (!address) return '';
    const addressStr = typeof address === 'string' ? address : String(address);
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'Never';
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    }) + ' UTC';
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>🏆 Leaderboard</h3>
        </div>
        
        <div className="modal-body">
          <div className="leaderboard-container">
            {leaderboard && leaderboard.length > 0 ? (
              <div className="leaderboard-list">
                {leaderboard && leaderboard[0] && leaderboard[0].map((address, index) => (
                  <div key={index} className="leaderboard-item">
                    <div className="rank">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </div>
                    <div className="player-info">
                      <div className="player-address">{formatAddress(address)}</div>
                      <div className="player-stats">
                        Level {leaderboard[1] ? Number(leaderboard[1][index]) || 1 : 1} • {leaderboard[2] ? Number(leaderboard[2][index]) || 0 : 0} points
                      </div>
                      <div className="player-date">
                        {formatDate(leaderboard[3] ? leaderboard[3][index] : 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-players">
                <p>No players yet!</p>
                <p>Be the first to save your progress on-chain.</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="modal-button primary" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;