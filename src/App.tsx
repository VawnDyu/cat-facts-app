import { useState, useEffect, useRef } from 'react';
import { Heart, RefreshCw, Star, Trash2, BookOpen, Sparkles, Moon, Sun, Download, Cat, Filter, Share2, Copy, Check } from 'lucide-react';
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
  const [filterRating, setFilterRating] = useState<number>(0);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [shareFactId, setShareFactId] = useState<string | null>(null);
  const [copiedFactId, setCopiedFactId] = useState<string | null>(null);
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

  // Close dropdown when clicking outside
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

  const shareFact = (fact: string, platform: 'facebook' | 'twitter' | 'whatsapp' | 'native') => {
    const text = `🐱 Cat Fact: ${fact}`;

    if (platform === 'native') {
      // Use Web Share API (works on mobile and some desktop browsers)
      if (navigator.share) {
        navigator.share({
          title: 'Cat Fact',
          text: text,
        }).then(() => {
          setShareFactId(null);
        }).catch((error) => {
          console.log('Error sharing:', error);
        });
      }
      return;
    }

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareFactId(null);
  };

  const copyFactToClipboard = async (fact: string, factId: string) => {
    const text = `🐱 Cat Fact: ${fact}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedFactId(factId);
      setTimeout(() => setCopiedFactId(null), 2000);
      setShareFactId(null);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

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

  const filteredFacts = filterRating === 0
    ? savedFactsList
    : savedFactsList.filter(fact => fact.rating === filterRating);

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
            {/* Filter and Export Section */}
            {savedFactsList.length > 0 && (
              <div className="filter-export-container">
                {/* Custom Filter Dropdown */}
                <div className="filter-dropdown-container">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="filter-button"
                    style={{
                      background: theme.cardBg,
                      borderColor: showFilterDropdown ? theme.accent : theme.border,
                      boxShadow: theme.shadow,
                      color: theme.text,
                    }}
                    onMouseEnter={(e) => {
                      if (!showFilterDropdown) {
                        e.currentTarget.style.borderColor = theme.accent;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showFilterDropdown) {
                        e.currentTarget.style.borderColor = theme.border;
                      }
                    }}
                  >
                    <Filter size={18} color={theme.accent} />
                    <span className="filter-button-label">
                      {filterRating === 0 ? 'All Ratings' : (
                        <>
                          {Array.from({ length: filterRating }).map((_, i) => (
                            <Star key={i} size={12} fill={theme.accent} color={theme.accent} />
                          ))}
                          <span>({filterRating})</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Custom Dropdown Menu */}
                  {showFilterDropdown && (
                    <div
                      className="custom-dropdown"
                      style={{
                        background: theme.cardBg,
                        borderColor: theme.border,
                        boxShadow: theme.shadow,
                      }}
                    >
                      <button
                        onClick={() => {
                          setFilterRating(0);
                          setShowFilterDropdown(false);
                        }}
                        className={`dropdown-option filter-all ${filterRating === 0 ? 'active' : ''}`}
                        style={{
                          background: filterRating === 0 ? theme.accent : 'transparent',
                          color: filterRating === 0 ? 'white' : theme.text,
                        }}
                        onMouseEnter={(e) => {
                          if (filterRating !== 0) {
                            e.currentTarget.style.background = theme.border;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (filterRating !== 0) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        All Ratings
                      </button>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => {
                            setFilterRating(rating);
                            setShowFilterDropdown(false);
                          }}
                          className={`dropdown-option ${filterRating === rating ? 'active' : ''}`}
                          style={{
                            background: filterRating === rating ? theme.accent : 'transparent',
                            color: filterRating === rating ? 'white' : theme.text,
                          }}
                          onMouseEnter={(e) => {
                            if (filterRating !== rating) {
                              e.currentTarget.style.background = theme.border;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (filterRating !== rating) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <div className="star-group">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={filterRating === rating ? 'white' : theme.accent}
                                color={filterRating === rating ? 'white' : theme.accent}
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

                {/* Export Button */}
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
                <div className="empty-state" style={{ background: theme.cardBg, boxShadow: theme.shadow }}>
                  <div className="empty-state-emoji" style={{ color: theme.textSecondary }}>
                    <Cat size={60} />
                  </div>
                  <p className="empty-state-text" style={{ color: theme.textSecondary }}>
                    {savedFactsList.length === 0
                      ? "No saved facts yet. Save your favorite cat facts to read them later!"
                      : `No facts with ${filterRating} star${filterRating !== 1 ? 's' : ''}. Try a different filter!`
                    }
                  </p>
                </div>
              ) : (
                <div className="saved-facts-list">
                  {filteredFacts.map((fact) => (
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
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, position: 'relative' }}>
                          {/* Share Button */}
                          <div className="share-dropdown-container" style={{ position: 'relative' }}>
                            <button
                              onClick={() => setShareFactId(shareFactId === fact.id ? null : fact.id)}
                              className="delete-button"
                              style={{
                                background: theme.cardBg,
                                color: theme.accent,
                                border: `2px solid ${theme.border}`,
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

                            {/* Share Dropdown */}
                            {shareFactId === fact.id && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 0.5rem)',
                                  right: 0,
                                  background: theme.cardBg,
                                  border: `2px solid ${theme.border}`,
                                  borderRadius: '10px',
                                  boxShadow: theme.shadow,
                                  zIndex: 10,
                                  minWidth: '180px',
                                  overflow: 'hidden',
                                  animation: 'slideDown 0.2s ease-out',
                                }}
                              >
                                {/* Copy to Clipboard */}
                                <button
                                  onClick={() => copyFactToClipboard(fact.fact, fact.id)}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'transparent',
                                    color: theme.text,
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = theme.accent;
                                    e.currentTarget.style.color = 'white';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = theme.text;
                                  }}
                                >
                                  <Copy size={16} />
                                  Copy to Clipboard
                                </button>

                                {/* Web Share API (Mobile) */}
                                {typeof navigator.share === 'function' && (
                                  <button
                                    onClick={() => shareFact(fact.fact, 'native')}
                                    style={{
                                      width: '100%',
                                      padding: '0.75rem 1rem',
                                      background: 'transparent',
                                      color: theme.text,
                                      border: 'none',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                      fontSize: '0.9rem',
                                      transition: 'all 0.2s',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = theme.accent;
                                      e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.color = theme.text;
                                    }}
                                  >
                                    <Share2 size={16} />
                                    Share...
                                  </button>
                                )}

                                <button
                                  onClick={() => shareFact(fact.fact, 'facebook')}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'transparent',
                                    color: theme.text,
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#1877F2';
                                    e.currentTarget.style.color = 'white';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = theme.text;
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                  Facebook
                                </button>
                                <button
                                  onClick={() => shareFact(fact.fact, 'twitter')}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'transparent',
                                    color: theme.text,
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#000000';
                                    e.currentTarget.style.color = 'white';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = theme.text;
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                  </svg>
                                  X (Twitter)
                                </button>
                                <button
                                  onClick={() => shareFact(fact.fact, 'whatsapp')}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'transparent',
                                    color: theme.text,
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#25D366';
                                    e.currentTarget.style.color = 'white';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = theme.text;
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                  </svg>
                                  WhatsApp
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Copy Success Indicator */}
                          {copiedFactId === fact.id && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '-2.5rem',
                                right: '0',
                                background: theme.accent,
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                boxShadow: theme.shadow,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                animation: 'slideDown 0.2s ease-out',
                                zIndex: 20,
                              }}
                            >
                              <Check size={16} />
                              Copied!
                            </div>
                          )}

                          {/* Delete Button */}
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