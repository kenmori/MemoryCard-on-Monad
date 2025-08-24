import { useState, useEffect } from 'react';
import { useMemoryGameContract } from '../hooks/useMemoryGameContract';

function SaveProgressModal({ isOpen, onClose, score, level, onSaveComplete }) {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { 
    updateProgress, 
    isPlayerRegistered, 
    registerPlayer, 
    playerData, 
    isWritePending, 
    writeError,
    isTransactionLoading,
    isTransactionSuccess 
  } = useMemoryGameContract();

  // トランザクション成功を監視
  useEffect(() => {
    if (isTransactionSuccess && isSaving) {
      // トランザクション成功トースト表示
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onSaveComplete?.();
        onClose();
        setIsSaving(false);
      }, 2000);
    }
  }, [isTransactionSuccess, isSaving, onSaveComplete, onClose]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (!isPlayerRegistered) {
        await registerPlayer();
      }
      
      await updateProgress(score);
      // トランザクション完了はuseEffectで監視
    } catch (error) {
      console.error('Error saving progress:', error);
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {showSuccessToast && (
        <div className="success-toast">
          ✅ Transaction Successful! Progress Saved 💾
        </div>
      )}
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>{showSuccessToast ? 'Progress Saved!' : 'Save Your Progress?'}</h3>
          </div>
        
        <div className="modal-body">
          <div className="save-info">
            <div className="current-progress">
              <p><strong>Current Level:</strong> {level}</p>
              <p><strong>Current Score:</strong> {score}</p>
              {playerData && (
                <>
                  <p><strong>Best Score:</strong> {playerData.bestScore}</p>
                  <p><strong>Saved Level:</strong> {playerData.level}</p>
                </>
              )}
            </div>
            
            <div className="cost-info">
              <p>💎 Saving requires <strong>0.01 MON</strong></p>
              <p className="cost-description">
                Save your progress on-chain to continue 
                your game anytime from any device.
              </p>
            </div>
          </div>

          {writeError && (
            <div className="error-message">
              Error: {writeError.message}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button 
            className="modal-button secondary" 
            onClick={handleSkip}
            disabled={isSaving || isWritePending}
          >
            Skip
          </button>
          <button 
            className="modal-button primary" 
            onClick={handleSave}
            disabled={isSaving || isWritePending}
          >
{isSaving || isWritePending || isTransactionLoading ? 
              (isTransactionLoading ? 'Confirming...' : 'Saving...') : 
              'Save (0.01 MON)'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default SaveProgressModal;