import { useState } from 'react';
import { useMemoryGameContract } from '../hooks/useMemoryGameContract';

function SaveProgressModal({ isOpen, onClose, score, level, onSaveComplete }) {
  const [isSaving, setIsSaving] = useState(false);
  const { updateProgress, isPlayerRegistered, registerPlayer, playerData, isWritePending, writeError } = useMemoryGameContract();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (!isPlayerRegistered) {
        await registerPlayer();
      }
      
      await updateProgress(score);
      onSaveComplete?.();
      onClose();
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Save Your Progress?</h3>
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
            {isSaving || isWritePending ? 'Saving...' : 'Save (0.01 MON)'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveProgressModal;