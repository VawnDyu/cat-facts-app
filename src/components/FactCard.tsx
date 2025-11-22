import { Share2, Trash2, Check } from 'lucide-react';
import type { SavedFact, Theme, SocialPlatform } from '../types';
import { RatingStars } from './RatingStars';
import { ShareDropdown } from './ShareDropdown';

interface FactCardProps {
  fact: SavedFact;
  theme: Theme;
  isDeleting: boolean;
  isShareOpen: boolean;
  isCopied: boolean;
  onShareToggle: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onSharePlatform: (platform: SocialPlatform) => void;
}

export const FactCard = ({
  fact,
  theme,
  isDeleting,
  isShareOpen,
  isCopied,
  onShareToggle,
  onCopy,
  onDelete,
  onSharePlatform
}: FactCardProps) => {
  return (
    <div
      className={`saved-fact-item ${isDeleting ? 'deleting' : ''}`}
      style={{ background: theme.cardBg, boxShadow: theme.shadow }}
    >
      <div className="saved-fact-content">
        <div className="saved-fact-details">
          <p className="saved-fact-text" style={{ color: theme.text }}>
            {fact.fact}
          </p>
          <RatingStars
            rating={fact.rating}
            theme={theme}
            size={14}
            interactive={false}
          />
        </div>

        <div className="fact-actions">
          {/* Share Button */}
          <div className="share-dropdown-container">
            <button
              onClick={onShareToggle}
              className="delete-button share-button"
              style={{
                background: theme.cardBg,
                color: theme.accent,
                borderColor: theme.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              <Share2 size={16} />
            </button>

            <ShareDropdown
              theme={theme}
              isOpen={isShareOpen}
              onCopy={onCopy}
              onShare={onSharePlatform}
            />
          </div>

          {/* Copy Success Indicator */}
          {isCopied && (
            <div
              className="copy-toast"
              style={{
                background: theme.accent,
                boxShadow: theme.shadow,
              }}
            >
              <Check size={16} />
              Copied!
            </div>
          )}

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="delete-button"
            style={{
              background: theme.deleteBtn,
              color: theme.deleteIcon,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.deleteBtnHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.deleteBtn;
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};