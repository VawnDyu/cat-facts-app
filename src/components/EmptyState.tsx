import { Cat } from 'lucide-react';
import type { Theme } from '../types';

interface EmptyStateProps {
  theme: Theme;
  message: string;
}

export const EmptyState = ({ theme, message }: EmptyStateProps) => {
  return (
    <div className="empty-state" style={{ background: theme.cardBg, boxShadow: theme.shadow }}>
      <div className="empty-state-emoji" style={{ color: theme.textSecondary }}>
        <Cat size={60} />
      </div>
      <p className="empty-state-text" style={{ color: theme.textSecondary }}>
        {message}
      </p>
    </div>
  );
};