import { useState, useEffect, useRef } from 'react';
import { Heart, RefreshCw, BookOpen, Sparkles, Moon, Sun, Download, Cat } from 'lucide-react';
import './App.css';
import type { CatFact, SavedFact } from './types';
import { exportToText } from './utils/export';
import { deleteFactWithAnimation } from './utils/animations';
import { useFactManagement } from './hooks/useFactManagement';
import { useTheme } from './hooks/useTheme';
import { shareFact, copyFactToClipboard } from './utils/shareUtils';
import { ANIMATION_DURATION } from './constants';
import { FactCard } from './components/FactCard';
import { FilterDropdown } from './components/FilterDropdown';
import { RatingStars } from './components/RatingStars';
import { EmptyState } from './components/EmptyState';
import type { SocialPlatform } from './types';

export default function App() {
  // Custom Hooks
  const { theme, isDark, toggleTheme } = useTheme();
  const {
    savedFactsList,
    filteredFacts,
    filterRating,
    setFilterRating,
    deleteFact: deleteFactFromHook,
    addFact
  } = useFactManagement();

  // Local State
  const [currentFact, setCurrentFact] = useState<CatFact | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [factAnimation, setFactAnimation] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [shareFactId, setShareFactId] = useState<string | null>(null);
  const [copiedFactId, setCopiedFactId] = useState<string | null>(null);
  const [deletedFactId, setDeletedFactId] = useState<string | null>(null);
  const [showRatingError, setShowRatingError] = useState(false);
  const [isApiError, setIsApiError] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    fetchRandomFact();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showFilterDropdown && !target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
      if (shareFactId && !target.closest('.share-dropdown-container')) {
        setShareFactId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown, shareFactId]);

  // Handlers
  const handleShareFact = async (fact: string, platform: SocialPlatform) => {
    const success = await shareFact(fact, platform);
    if (success) {
      setShareFactId(null);
    }
  };

  const handleCopyFact = async (fact: string, factId: string) => {
    const success = await copyFactToClipboard(fact);
    if (success) {
      setCopiedFactId(factId);
      setTimeout(() => setCopiedFactId(null), ANIMATION_DURATION.COPY_TOAST);
      setShareFactId(null);
    }
  };

  const fetchRandomFact = async () => {
    setLoading(true);
    setFactAnimation(false);
    setRating(0);
    setIsApiError(false); // Reset error state

    try {
      const response = await fetch('https://catfact.ninja/fact');

      if (response.status === 429) {
        // Rate limited - show a friendly message
        setCurrentFact({
          fact: "Oops! We've fetched too many facts too quickly. Please wait a moment and try again. 🐱",
          length: 0
        });
        setIsApiError(true); // Mark as error
        setTimeout(() => setFactAnimation(true), ANIMATION_DURATION.FACT_LOAD);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentFact(data);
      setIsApiError(false); // Success - clear error
      setTimeout(() => setFactAnimation(true), ANIMATION_DURATION.FACT_LOAD);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
      setCurrentFact({
        fact: "Couldn't fetch a cat fact right now. Please try again! 🐱",
        length: 0
      });
      setIsApiError(true); // Mark as error
      setTimeout(() => setFactAnimation(true), ANIMATION_DURATION.FACT_LOAD);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFact = () => {
    if (!currentFact) return;

    // Prevent saving if it's an error message
    if (isApiError) {
      setShowRatingError(true);
      setTimeout(() => setShowRatingError(false), 2000);
      return;
    }

    // Prevent saving if no rating is given
    if (rating === 0) {
      setShowRatingError(true);
      setTimeout(() => setShowRatingError(false), 2000);
      return;
    }

    const newSavedFact: SavedFact = {
      id: Date.now().toString(),
      fact: currentFact.fact,
      rating: rating,
      savedAt: Date.now(),
    };

    addFact(newSavedFact);
    setTimeout(() => fetchRandomFact(), ANIMATION_DURATION.NEW_FACT_DELAY);
  };

  const deleteFact = (id: string) => {
    deleteFactWithAnimation(
      id,
      setDeletedFactId,
      () => deleteFactFromHook(id)
    );
  };

  const handleFilterSelect = (rating: number) => {
    setFilterRating(rating);
    setShowFilterDropdown(false);
  };

  const getEmptyMessage = () => {
    if (savedFactsList.length === 0) {
      return "No saved facts yet. Save your favorite cat facts to read them later!";
    }
    return `No facts with ${filterRating} star${filterRating !== 1 ? 's' : ''}. Try a different filter!`;
  };

  return (
    <div className="app-container" style={{ background: theme.bg }}>
      <div className="app-content">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-emoji" style={{ color: theme.accent }}>
              <Cat size={48} />
            </div>
            <h1 className="header-title" style={{ color: theme.text }}>Cat Facts</h1>
            <p className="header-subtitle" style={{ color: theme.textSecondary }}>
              Learn something new about cats
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            style={{
              background: theme.cardBg,
              borderColor: theme.border,
              color: theme.text,
              boxShadow: theme.shadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.color = theme.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.color = theme.text;
            }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation" style={{ background: theme.cardBg, boxShadow: theme.shadow }}>
          <button
            onClick={() => setShowSaved(false)}
            className={`tab-button ${!showSaved ? 'active' : 'inactive'}`}
            style={{
              background: !showSaved ? theme.accent : 'transparent',
              color: !showSaved ? 'white' : theme.textSecondary,
            }}
          >
            <Sparkles size={16} />
            Discover
          </button>
          <button
            onClick={() => setShowSaved(true)}
            className={`tab-button ${showSaved ? 'active' : 'inactive'}`}
            style={{
              background: showSaved ? theme.accent : 'transparent',
              color: showSaved ? 'white' : theme.textSecondary,
            }}
          >
            <BookOpen size={16} />
            Saved {savedFactsList.length > 0 && `(${savedFactsList.length})`}
          </button>
        </div>

        {!showSaved ? (
          /* Current Fact View */
          <div>
            <div className="fact-card" style={{ background: theme.cardBg, boxShadow: theme.shadow }}>
              {loading ? (
                <div className="fact-loading" style={{ color: theme.accent }}>
                  <Cat size={60} />
                </div>
              ) : currentFact ? (
                <div
                  className="fact-content"
                  style={{
                    opacity: factAnimation ? 1 : 0,
                    transform: factAnimation ? 'translateY(0)' : 'translateY(10px)',
                  }}
                >
                  <p className="fact-text" style={{ color: theme.text }}>
                    {currentFact.fact}
                  </p>
                </div>
              ) : null}
            </div>

            {currentFact && (
              <div className="rating-card" style={{ background: theme.cardBg, boxShadow: theme.shadow }}>
                <p
                  className="rating-title"
                  style={{
                    color: showRatingError ? '#ef4444' : theme.textSecondary,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {showRatingError
                    ? (isApiError
                        ? '⚠️ Cannot save error messages!'
                        : '⭐ Please rate the fact before saving!')
                    : 'How interesting is this fact?'
                  }
                </p>
                <RatingStars
                  rating={rating}
                  hoverRating={hoverRating}
                  onRate={(r) => {
                    if (!isApiError) { // Only allow rating if not an error
                      setRating(r);
                      setShowRatingError(false);
                    }
                  }}
                  onHover={!isApiError ? setHoverRating : undefined}
                  theme={theme}
                />
              </div>
            )}

            <div className="action-buttons">
              <button
                onClick={fetchRandomFact}
                disabled={loading}
                className="action-button new-fact-button"
                style={{
                  background: theme.buttonBg,
                  color: theme.text,
                  borderColor: theme.border,
                  boxShadow: theme.shadow,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = theme.accent;
                    e.currentTarget.style.color = theme.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.color = theme.text;
                }}
              >
                <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                New Fact
              </button>
              <button
                onClick={handleSaveFact}
                disabled={!currentFact || rating === 0 || isApiError}
                className="action-button save-button"
                style={{
                  background: theme.accent,
                  opacity: (currentFact && rating > 0 && !isApiError) ? 1 : 0.5,
                  boxShadow: theme.shadow,
                  cursor: (currentFact && rating > 0 && !isApiError) ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={(e) => {
                  if (currentFact && rating > 0 && !isApiError) {
                    e.currentTarget.style.background = theme.accentHover;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme.accent;
                }}
              >
                <Heart size={18} />
                Save
              </button>
            </div>
          </div>
        ) : (
          /* Saved Facts View */
          <div>
            {/* Filter and Export Section */}
            {savedFactsList.length > 0 && (
              <div className="filter-export-container">
                <FilterDropdown
                  theme={theme}
                  currentRating={filterRating}
                  isOpen={showFilterDropdown}
                  onSelect={handleFilterSelect}
                  onToggle={() => setShowFilterDropdown(!showFilterDropdown)}
                />

                <button
                  onClick={() => exportToText(savedFactsList)}
                  className="export-button"
                  style={{ background: theme.accent, boxShadow: theme.shadow }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.accentHover;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme.accent;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            )}

            <div className="saved-facts-container">
              {filteredFacts.length === 0 ? (
                <EmptyState theme={theme} message={getEmptyMessage()} />
              ) : (
                <div className="saved-facts-list">
                  {filteredFacts.map((fact) => (
                    <FactCard
                      key={fact.id}
                      fact={fact}
                      theme={theme}
                      isDeleting={deletedFactId === fact.id}
                      isShareOpen={shareFactId === fact.id}
                      isCopied={copiedFactId === fact.id}
                      onShareToggle={() => setShareFactId(shareFactId === fact.id ? null : fact.id)}
                      onCopy={() => handleCopyFact(fact.fact, fact.id)}
                      onDelete={() => deleteFact(fact.id)}
                      onSharePlatform={(platform) => handleShareFact(fact.fact, platform)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}