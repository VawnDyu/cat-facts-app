import { useState, useEffect, useRef } from 'react';
import { Heart, RefreshCw, Star, Trash2, BookOpen, Sparkles, Moon, Sun, Download, Cat } from 'lucide-react';
import './App.css';
import type { CatFact, SavedFact } from './types';
import { getTheme } from './utils/theme';
import { loadFacts, saveFacts, loadTheme, saveTheme } from './utils/storage';
import { exportToText } from './utils/export';

export default function App() {
  const [currentFact, setCurrentFact] = useState<CatFact | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedFactsList, setSavedFactsList] = useState<SavedFact[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [factAnimation, setFactAnimation] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setSavedFactsList(loadFacts());
    setIsDark(loadTheme());
    fetchRandomFact();
  }, []);

  useEffect(() => {
    if (hasInitialized.current) {
      saveFacts(savedFactsList);
    }
  }, [savedFactsList]);

  useEffect(() => {
    if (hasInitialized.current) {
      saveTheme(isDark);
    }
  }, [isDark]);

  const fetchRandomFact = async () => {
    setLoading(true);
    setFactAnimation(false);
    setRating(0);

    try {
      const response = await fetch('https://catfact.ninja/fact');
      const data = await response.json();
      setCurrentFact(data);
      setTimeout(() => setFactAnimation(true), 100);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFact = () => {
    if (!currentFact) return;

    const newSavedFact: SavedFact = {
      id: Date.now().toString(),
      fact: currentFact.fact,
      rating: rating,
      savedAt: Date.now(),
    };

    setSavedFactsList([newSavedFact, ...savedFactsList]);
    setTimeout(() => fetchRandomFact(), 300);
  };

  const deleteFact = (id: string) => {
    setSavedFactsList(savedFactsList.filter(f => f.id !== id));
  };

  const theme = getTheme(isDark);

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
            onClick={() => setIsDark(!isDark)}
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
                <p className="rating-title" style={{ color: theme.textSecondary }}>
                  How interesting is this fact?
                </p>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="star-button"
                      style={{
                        transform: (hoverRating >= star || rating >= star) ? 'scale(1.15)' : 'scale(1)',
                      }}
                    >
                      <Star
                        size={24}
                        fill={(hoverRating >= star || rating >= star) ? theme.accent : 'none'}
                        color={(hoverRating >= star || rating >= star) ? theme.accent : theme.border}
                        strokeWidth={2.5}
                      />
                    </button>
                  ))}
                </div>
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
                disabled={!currentFact}
                className="action-button save-button"
                style={{
                  background: theme.accent,
                  opacity: currentFact ? 1 : 0.5,
                  boxShadow: theme.shadow,
                }}
                onMouseEnter={(e) => currentFact && (e.currentTarget.style.background = theme.accentHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = theme.accent)}
              >
                <Heart size={18} />
                Save
              </button>
            </div>
          </div>
        ) : (
          /* Saved Facts View */
          <div>
            {savedFactsList.length > 0 && (
              <div className="export-container">
                <button
                  onClick={() => exportToText(savedFactsList)}
                  className="export-button"
                  style={{ background: theme.accent, boxShadow: theme.shadow }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = theme.accentHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = theme.accent)}
                >
                  <Download size={16} />
                  Export as Text
                </button>
              </div>
            )}

            <div className="saved-facts-container">
              {savedFactsList.length === 0 ? (
                <div className="empty-state" style={{ background: theme.cardBg, boxShadow: theme.shadow }}>
                  <div className="empty-state-emoji" style={{ color: theme.textSecondary }}>
                    <Cat size={60} />
                  </div>
                  <p className="empty-state-text" style={{ color: theme.textSecondary }}>
                    No saved facts yet. Save your favorite cat facts to read them later!
                  </p>
                </div>
              ) : (
                <div className="saved-facts-list">
                  {savedFactsList.map((fact) => (
                    <div
                      key={fact.id}
                      className="saved-fact-item"
                      style={{ background: theme.cardBg, boxShadow: theme.shadow }}
                    >
                      <div className="saved-fact-content">
                        <div className="saved-fact-details">
                          <p className="saved-fact-text" style={{ color: theme.text }}>
                            {fact.fact}
                          </p>
                          <div className="saved-fact-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                fill={star <= fact.rating ? theme.accent : 'none'}
                                color={star <= fact.rating ? theme.accent : theme.border}
                                strokeWidth={2.5}
                              />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteFact(fact.id)}
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