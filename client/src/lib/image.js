export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'

export function resolveImage(src) {
  if (!src || typeof src !== 'string') return FALLBACK_IMG
  const s = src.trim()
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s
  // If DB stores just a filename (e.g., 'headphones.jpg'), we currently don't host it
  // Return fallback to avoid broken images
  return FALLBACK_IMG
}
