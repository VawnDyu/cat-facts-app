import { Filter, Star } from 'lucide-react';
import type { Theme } from '../types';

interface FilterDropdownProps {
  theme: Theme;
  currentRating: number;
  isOpen: boolean;
  onSelect: (rating: number) => void;
  onToggle: () => void;
}

export const FilterDropdown = ({
  theme,
  currentRating,
  isOpen,
  onSelect,
  onToggle
}: FilterDropdownProps) => {
  return (
    <div className="filter-dropdown-container">
      <button
        onClick={onToggle}
        className="filter-button"
        style={{
          background: theme.cardBg,
          borderColor: isOpen ? theme.accent : theme.border,
          boxShadow: theme.shadow,
          color: theme.text,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = theme.accent;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = theme.border;
          }
        }}
      >
        <Filter size={18} color={theme.accent} />
        <span className="filter-button-label">
          {currentRating === 0 ? 'All Ratings' : (
            <>
              {Array.from({ length: currentRating }).map((_, i) => (
                <Star key={i} size={12} fill={theme.accent} color={theme.accent} />
              ))}
              <span>({currentRating})</span>
            </>
          )}
        </span>
      </button>

      {isOpen && (
        <div
          className="custom-dropdown"
          style={{
            background: theme.cardBg,
            borderColor: theme.border,
            boxShadow: theme.shadow,
          }}
        >
          <button
            onClick={() => onSelect(0)}
            className={`dropdown-option filter-all ${currentRating === 0 ? 'active' : ''}`}
            style={{
              background: currentRating === 0 ? theme.accent : 'transparent',
              color: currentRating === 0 ? 'white' : theme.text,
            }}
            onMouseEnter={(e) => {
              if (currentRating !== 0) {
                e.currentTarget.style.background = theme.border;
              }
            }}
            onMouseLeave={(e) => {
              if (currentRating !== 0) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => onSelect(rating)}
              className={`dropdown-option ${currentRating === rating ? 'active' : ''}`}
              style={{
                background: currentRating === rating ? theme.accent : 'transparent',
                color: currentRating === rating ? 'white' : theme.text,
              }}
              onMouseEnter={(e) => {
                if (currentRating !== rating) {
                  e.currentTarget.style.background = theme.border;
                }
              }}
              onMouseLeave={(e) => {
                if (currentRating !== rating) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div className="star-group">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={currentRating === rating ? 'white' : theme.accent}
                    color={currentRating === rating ? 'white' : theme.accent}
                    strokeWidth={2}
                  />
                ))}
              </div>
              <span>({rating} star{rating !== 1 ? 's' : ''})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};