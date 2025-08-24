import { useState, useEffect } from 'react';

const CARD_SYMBOLS = ['🎮', '🚀', '💎', '⚡', '🎯', '🔥', '💫', '🎪'];

const LEVEL_CONFIG = {
  1: { cards: 6, time: 5 },
  2: { cards: 8, time: 5 }, 3: { cards: 8, time: 5 },
  4: { cards: 10, time: 5 }, 5: { cards: 10, time: 5 }, 6: { cards: 10, time: 5 },
  7: { cards: 12, time: 5 }, 8: { cards: 12, time: 5 }, 9: { cards: 12, time: 5 }, 10: { cards: 12, time: 5 },
  11: { cards: 16, time: 5 }, 12: { cards: 16, time: 5 }, 13: { cards: 16, time: 5 }, 14: { cards: 16, time: 5 }, 15: { cards: 16, time: 5 },
};

function MemoryGame({ level = 1, onLevelComplete, onScoreUpdate, onSaveProgress }) {
  const [gameState, setGameState] = useState('memorizing'); // memorizing, playing, completed
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [floatingCards, setFloatingCards] = useState([]);
  const [showNiceAnimation, setShowNiceAnimation] = useState(false);
  const [animationText, setAnimationText] = useState('Nice💜');
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);

  const config = LEVEL_CONFIG[level] || { cards: 16, time: 5 };
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
    setFloatingCards([]);
    setShowNiceAnimation(false);
    setAttempts(0);
    setGameState('memorizing');
    setTimer(config.time);
    setScore(0);
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
        
        // Randomly choose between "Nice💜" and "GMonad💜" (20% chance for GMonad)
        const isGMonad = Math.random() < 0.2;
        setAnimationText(isGMonad ? 'GMonad💜' : 'Nice💜');
        setShowNiceAnimation(true);

        // Show congratulations when all pairs are matched
        if (newMatchedCards.length === cards.length) {
          setTimeout(() => {
            setAnimationText('Congratulations🥳');
            setShowNiceAnimation(true);
          }, 600);
        }
        
        const matchScore = 100;
        const newScore = score + matchScore;
        setScore(newScore);
        onScoreUpdate?.(newScore);

        setTimeout(() => {
          setFlippedCards([]);
          setShowNiceAnimation(false);
          
          if (newMatchedCards.length === cards.length) {
            setGameState('completed');
            onLevelComplete?.(newScore);
          }
        }, newMatchedCards.length === cards.length ? 2000 : 1200);
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
      {showNiceAnimation && (
        <div className="nice-animation">{animationText}</div>
      )}
      
      <div className="game-info">
        {gameState === 'memorizing' && (
          <div className="memorizing-phase">
            <div className="timer">Memory Time: {timer}s</div>
            <p>Memorize the card positions!</p>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div className="playing-phase">
            <div className="game-stats">
              <div>Attempts: {attempts}</div>
              <div>Score: {score}</div>
              <div>Remaining: {(config.cards - matchedCards.length) / 2} pairs</div>
            </div>
            <button 
              className="back-to-menu-btn"
              onClick={() => onSaveProgress?.(score)}
            >
              Back to Menu
            </button>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="completed-phase">
            <h3>Level {level} Complete!</h3>
            <div>Final Score: {score}</div>
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
          Next Level
        </button>
      )}
    </div>
  );
}

export default MemoryGame;