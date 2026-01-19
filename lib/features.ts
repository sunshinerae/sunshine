/**
 * Feature Flags for The Sunshine Effect
 *
 * This system enables phased rollout of features without deleting code.
 * To enable a feature, simply change its value from false to true.
 *
 * PHASE 1 (Current): About page + Email signup
 * PHASE 2 (Future): Offerings, Events, Community, etc.
 *
 * Usage:
 * - In components: import { isFeatureEnabled } from '@/lib/features'
 * - In pages: if (!isFeatureEnabled('offerings')) { notFound(); }
 * - In navigation: import { getActiveNavItems } from '@/lib/features'
 */

export type FeatureFlag = keyof typeof FEATURES;

export const FEATURES = {
  // PHASE 1: Active features (launch state)
  about: true,
  emailSignup: true,
  blog: true,

  // PHASE 2+: Features to enable later
  offerings: true,
  events: true,
  community: true,
  coaching: false,
  retreats: false,
  smsSignup: false,
  testimonials: false,
  eventBooking: false,
  fullContact: true,
} as const;

/**
 * Check if a specific feature is enabled
 * @param feature - The feature flag to check
 * @returns true if the feature is enabled, false otherwise
 *
 * @example
 * if (isFeatureEnabled('offerings')) {
 *   // Show offerings section
 * }
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURES[feature] ?? false;
}

/**
 * Navigation item type
 */
export type NavItem = {
  label: string;
  href: string;
  feature: FeatureFlag;
};

/**
 * All possible navigation items (full site)
 */
const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/', feature: 'about' },
  { label: 'Offerings', href: '/offerings', feature: 'offerings' },
  { label: 'Events', href: '/events', feature: 'events' },
  { label: 'Community', href: '/community', feature: 'community' },
  { label: 'Contact', href: '/contact', feature: 'fullContact' },
];

/**
 * Get only the navigation items for enabled features
 * @returns Array of navigation items that should be displayed
 *
 * @example
 * const navItems = getActiveNavItems();
 * navItems.map(item => <NavLink href={item.href}>{item.label}</NavLink>)
 */
export function getActiveNavItems(): NavItem[] {
  return ALL_NAV_ITEMS.filter(item => isFeatureEnabled(item.feature));
}
