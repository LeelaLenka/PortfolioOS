/**
 * HomePage.tsx — Landing page composing Hero + future CMS sections
 *
 * WHY: Home only wires reusable components — no inline copy.
 *      `heroContent` will come from React Query in Phase 5.
 */

import { Hero } from '../components/Hero';
import type { HeroContent } from '@/types';

/** CMS hook placeholder — pass undefined until API is connected */
const heroContent: HeroContent | undefined = undefined;

export function HomePage() {
  return <Hero content={heroContent} />;
}
