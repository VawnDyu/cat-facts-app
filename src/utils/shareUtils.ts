import { SOCIAL_PLATFORMS } from '../constants';
import type { SocialPlatform } from '../types';

export const shareFact = async (fact: string, platform: SocialPlatform): Promise<boolean> => {
  const text = `🐱 Cat Fact: ${fact}`;

  try {
    switch (platform) {
      case SOCIAL_PLATFORMS.NATIVE:
        // Use Web Share API (works on mobile and some desktop browsers)
        if (navigator.share) {
          await navigator.share({
            title: 'Cat Fact',
            text: text,
          });
          return true;
        }
        // Fallback if Web Share API is not available
        console.warn('Web Share API not supported');
        return false;

      case SOCIAL_PLATFORMS.FACEBOOK:
        window.open(
          `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
          '_blank',
          'width=600,height=400'
        );
        return true;

      case SOCIAL_PLATFORMS.TWITTER:
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
          '_blank',
          'width=600,height=400'
        );
        return true;

      case SOCIAL_PLATFORMS.WHATSAPP:
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          '_blank',
          'width=600,height=400'
        );
        return true;

      default:
        console.warn(`Unknown platform: ${platform}`);
        return false;
    }
  } catch (error) {
    console.error('Error sharing fact:', error);
    return false;
  }
};

export const copyFactToClipboard = async (fact: string): Promise<boolean> => {
  const text = `🐱 Cat Fact: ${fact}`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};