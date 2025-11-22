export const ANIMATION_DURATION = {
  FACT_LOAD: 100,
  DELETE: 300,
  COPY_TOAST: 2000,
  NEW_FACT_DELAY: 300,
} as const;

export const SOCIAL_PLATFORMS = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  WHATSAPP: 'whatsapp',
  NATIVE: 'native',
} as const;

// Export type for use in components
export type SocialPlatform = typeof SOCIAL_PLATFORMS[keyof typeof SOCIAL_PLATFORMS];