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
          <h3>進行状況を保存しますか？</h3>
        </div>
        
        <div className="modal-body">
          <div className="save-info">
            <div className="current-progress">
              <p><strong>現在のレベル:</strong> {level}</p>
              <p><strong>現在のスコア:</strong> {score}</p>
              {playerData && (
                <>
                  <p><strong>最高スコア:</strong> {playerData.bestScore}</p>
                  <p><strong>保存済みレベル:</strong> {playerData.level}</p>
                </>
              )}
            </div>
            
            <div className="cost-info">
              <p>💎 保存には <strong>0.01 MON</strong> が必要です</p>
              <p className="cost-description">
                進行状況をブロックチェーンに保存することで、
                いつでも続きからプレイできます。
              </p>
            </div>
          </div>

          {writeError && (
            <div className="error-message">
              エラー: {writeError.message}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button 
            className="modal-button secondary" 
            onClick={handleSkip}
            disabled={isSaving || isWritePending}
          >
            スキップ
          </button>
          <button 
            className="modal-button primary" 
            onClick={handleSave}
            disabled={isSaving || isWritePending}
          >
            {isSaving || isWritePending ? '保存中...' : '保存 (0.01 MON)'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveProgressModal;