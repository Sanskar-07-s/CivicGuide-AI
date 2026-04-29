import { generateShareCardText } from '../utils/shareUtils';

export const ShareCard = ({ stats, onClose }) => {
  const text = generateShareCardText(stats);
  const encodedText = encodeURIComponent(text);
  const url = encodeURIComponent(window.location.href);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${encodedText}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Share Your Civic Knowledge</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        
        <div className="share-card-preview">
          {text}
        </div>

        <div className="share-buttons">
          <button className="share-btn copy" onClick={copyToClipboard}>
            📋 Copy Card
          </button>
          <button className="share-btn linkedin" onClick={shareLinkedIn}>
            💼 Share on LinkedIn
          </button>
          <button className="share-btn twitter" onClick={shareTwitter}>
            🐦 Share on X
          </button>
        </div>
      </div>
    </div>
  );
};
