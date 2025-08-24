import { useState, useEffect } from 'react';

const CARD_SYMBOLS = ['🎮', '🚀', '💎', '⚡', '🎯', '🔥', '💫', '🎪'];

const LEVEL_CONFIG = {
  1: { cards: 6, time: 5, maxMistakes: 3 },
  2: { cards: 8, time: 5, maxMistakes: 3 }, 3: { cards: 8, time: 4, maxMistakes: 3 },
  4: { cards: 10, time: 4, maxMistakes: 3 }, 5: { cards: 10, time: 4, maxMistakes: 3 }, 6: { cards: 10, time: 3, maxMistakes: 3 },
  7: { cards: 12, time: 3, maxMistakes: 3 }, 8: { cards: 12, time: 3, maxMistakes: 3 }, 9: { cards: 12, time: 3, maxMistakes: 3 }, 10: { cards: 12, time: 2, maxMistakes: 3 },
  11: { cards: 16, time: 2, maxMistakes: 3 }, 12: { cards: 16, time: 2, maxMistakes: 3 }, 13: { cards: 16, time: 2, maxMistakes: 3 }, 14: { cards: 16, time: 1, maxMistakes: 3 }, 15: { cards: 16, time: 1, maxMistakes: 3 },
};

function MemoryGame({ level = 1, onLevelComplete, onScoreUpdate, onSaveProgress, isNewGame = false }) {
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const config = LEVEL_CONFIG[level] || { cards: 16, time: 5 };
  const gridCols = Math.ceil(Math.sqrt(config.cards));

  useEffect(() => {
    console.log('Level changed to:', level);
    initializeGame();
    
    // 新しいゲーム開始時のみ間違い回数をリセット
    if (level === 1) {
      setMistakes(0);
    }
  }, [level]);

  useEffect(() => {
    let interval;
    if (gameState === 'memorizing') {
      if (timer > 0) {
        interval = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              setGameState('playing');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (timer === 0) {
        setGameState('playing');
      }
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

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
    setScore(0);
    setTimer(config.time);
    setIsProcessing(false);
    // setMistakes(0); を削除 - 間違い回数はリセットしない
    
    // カードを設定した後、少し遅延してmemorizing状態に移行
    setTimeout(() => {
      setGameState('memorizing');
    }, 100);
  };

  const handleCardClick = (cardId) => {
    if (gameState !== 'playing') return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isMatched || flippedCards.includes(cardId)) return;
    
    // 既に2枚めくられている場合は、新しいペアを開始
    if (flippedCards.length >= 2) {
      if (isProcessing) return; // 処理中は新しいペアを開始できない
      setFlippedCards([cardId]);
      setIsProcessing(false);
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      // 2枚目をクリックした瞬間に処理をブロック
      setIsProcessing(true);
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
            setShowNiceAnimation(false);
            setTimeout(() => {
              setAnimationText('Congratulations🥳');
              setShowNiceAnimation(true);
            }, 100);
          }, 600);
        }
        
        const matchScore = 100;
        const newScore = score + matchScore;
        setScore(newScore);
        onScoreUpdate?.(newScore);

        setTimeout(() => {
          setFlippedCards([]);
          setShowNiceAnimation(false);
          // マッチした場合は500ms後に次のクリックを受け付ける（アニメーション考慮）
          setTimeout(() => {
            setIsProcessing(false);
          }, 500);
          
          if (newMatchedCards.length === cards.length) {
            setGameState('completed');
            // 3秒後に自動で次のレベルに進む
            setTimeout(() => {
              onLevelComplete?.(newScore);
            }, 3000);
          }
        }, newMatchedCards.length === cards.length ? 2000 : 1200);
      } else {
        // マッチしなかった場合
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        
        // ゲームオーバーチェック
        if (newMistakes >= config.maxMistakes) {
          setTimeout(() => {
            setFlippedCards([]);
            setGameState('gameover');
            setIsProcessing(false);
          }, 300);
        } else {
          // 300ms後に素早く両方のカードを閉じる
          setTimeout(() => {
            setFlippedCards([]);
            setIsProcessing(false); // 処理完了
          }, 300);
        }
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
              <div style={{color: mistakes >= config.maxMistakes * 0.8 ? '#dc2626' : '#64748b'}}>Mistakes: {mistakes}/{config.maxMistakes}</div>
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
        
        {gameState === 'gameover' && (
          <div className="gameover-phase">
            <h3>Game Over!</h3>
            <div>Too many mistakes on Level {level}</div>
            <div>Final Score: {score}</div>
            <button 
              className="start-button" 
              onClick={() => onSaveProgress?.(score)}
              style={{ marginTop: '1rem' }}
            >
              Back to Menu
            </button>
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
        <div style={{ marginTop: '1rem', fontSize: '1.25rem', color: '#10b981', fontWeight: '600' }}>
          Preparing next level...
        </div>
      )}
    </div>
  );
}

export default MemoryGame;