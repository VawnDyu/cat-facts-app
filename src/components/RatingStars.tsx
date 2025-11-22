import { Star } from 'lucide-react';
import type { Theme } from '../types';

interface RatingStarsProps {
  rating: number;
  hoverRating?: number;
  onRate?: (rating: number) => void;
  onHover?: (rating: number) => void;
  theme: Theme;
  size?: number;
  interactive?: boolean;
}

export const RatingStars = ({
  rating,
  hoverRating = 0,
  onRate,
  onHover,
  theme,
  size = 24,
  interactive = true
}: RatingStarsProps) => {
  const stars = [1, 2, 3, 4, 5];

  if (!interactive) {
    return (
      <div className="saved-fact-stars">
        {stars.map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? theme.accent : 'none'}
            color={star <= rating ? theme.accent : theme.border}
            strokeWidth={2.5}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rating-stars">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onHover?.(0)}
          className="star-button"
          style={{
            transform: (hoverRating >= star || rating >= star) ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          <Star
            size={size}
            fill={(hoverRating >= star || rating >= star) ? theme.accent : 'none'}
            color={(hoverRating >= star || rating >= star) ? theme.accent : theme.border}
            strokeWidth={2.5}
          />
        </button>
      ))}
    </div>
  );
};