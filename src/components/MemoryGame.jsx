import { useState, useEffect } from 'react';

const CARD_SYMBOLS = ['🎮', '🚀', '💎', '⚡', '🎯', '🔥', '💫', '🎪'];

const LEVEL_CONFIG = {
  1: { cards: 4, time: 8 },
  2: { cards: 6, time: 7 }, 3: { cards: 6, time: 7 },
  4: { cards: 8, time: 6 }, 5: { cards: 8, time: 6 }, 6: { cards: 8, time: 6 },
  7: { cards: 10, time: 5 }, 8: { cards: 10, time: 5 }, 9: { cards: 10, time: 5 }, 10: { cards: 10, time: 5 },
  11: { cards: 12, time: 4 }, 12: { cards: 12, time: 4 }, 13: { cards: 12, time: 4 }, 14: { cards: 12, time: 4 }, 15: { cards: 12, time: 4 },
};

function MemoryGame({ level = 1, onLevelComplete, onScoreUpdate }) {
  const [gameState, setGameState] = useState('memorizing'); // memorizing, playing, completed
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);

  const config = LEVEL_CONFIG[level] || { cards: 16, time: 3 };
  const gridCols = Math.ceil(Math.sqrt(config.cards));

  useEffect(() => {
    initializeGame();
  }, [level]);

  useEffect(() => {
    let interval;
    if (gameState === 'memorizing' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'memorizing' && timer === 0) {
      setGameState('playing');
    }
    return () => clearInterval(interval);
  }, [timer, gameState]);

  const initializeGame = () => {
    const numPairs = config.cards / 2;
    const symbols = CARD_SYMBOLS.slice(0, numPairs);
    const cardPairs = [...symbols, ...symbols];
    
    const shuffledCards = cardPairs
      .map((symbol, index) => ({ id: index, symbol, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setAttempts(0);
    setGameState('memorizing');
    setTimer(config.time);
  };

  const handleCardClick = (cardId) => {
    if (gameState !== 'playing' || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isMatched || flippedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        const newMatchedCards = [...matchedCards, firstId, secondId];
        setMatchedCards(newMatchedCards);
        
        const attemptScore = attempts === 0 ? 500 : attempts === 1 ? 250 : 100;
        const newScore = score + attemptScore;
        setScore(newScore);
        onScoreUpdate?.(newScore);

        setTimeout(() => {
          setFlippedCards([]);
          
          if (newMatchedCards.length === cards.length) {
            setGameState('completed');
            onLevelComplete?.(newScore);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isCardVisible = (cardId) => {
    return gameState === 'memorizing' || flippedCards.includes(cardId) || matchedCards.includes(cardId);
  };

  const getCardClass = (cardId) => {
    let className = 'card';
    if (isCardVisible(cardId)) className += ' flipped';
    if (matchedCards.includes(cardId)) className += ' matched';
    return className;
  };

  return (
    <div className="memory-game">
      <div className="game-info">
        {gameState === 'memorizing' && (
          <div className="memorizing-phase">
            <div className="timer">記憶時間: {timer}秒</div>
            <p>カードの配置を覚えてください！</p>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div className="playing-phase">
            <div className="game-stats">
              <div>試行回数: {attempts}</div>
              <div>スコア: {score}</div>
              <div>残り: {(config.cards - matchedCards.length) / 2}ペア</div>
            </div>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="completed-phase">
            <h3>レベル {level} クリア！</h3>
            <div>最終スコア: {score}</div>
          </div>
        )}
      </div>

      <div 
        className="game-board" 
        style={{ 
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          maxWidth: `${gridCols * 90}px`
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={getCardClass(card.id)}
            onClick={() => handleCardClick(card.id)}
          >
            {isCardVisible(card.id) ? card.symbol : '?'}
          </div>
        ))}
      </div>

      {gameState === 'completed' && (
        <button 
          className="start-button" 
          onClick={() => onLevelComplete?.(score)}
          style={{ marginTop: '1rem' }}
        >
          次のレベルへ
        </button>
      )}
    </div>
  );
}

export default MemoryGame;