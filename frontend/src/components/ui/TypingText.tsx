/**
 * TypingText.tsx — Typewriter / role-cycling animation
 *
 * WHY: Hero sections at Linear and Stripe cycle role titles — this component is reusable
 *      and fully driven by the `strings` prop from CMS.
 *
 * HOW:
 * 1. Types current string character by character
 * 2. Pauses, deletes, moves to next string
 * 3. Renders nothing if `strings` is empty (no dummy fallback)
 *
 * ACCESSIBILITY: aria-live="polite" announces changes to screen readers.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/utils';

interface TypingTextProps {
  strings: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypingText({
  strings,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  className,
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (strings.length === 0) {
      setDisplayText('');
      return;
    }

    const current = strings[stringIndex] ?? '';

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < current.length) {
            setDisplayText(current.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else if (displayText.length > 0) {
          setDisplayText(current.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setStringIndex((prev) => (prev + 1) % strings.length);
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [
    strings,
    stringIndex,
    displayText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  if (strings.length === 0) return null;

  return (
    <span className={cn('inline-flex items-center', className)} aria-live="polite">
      <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
        {displayText}
      </span>
      <span
        className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-secondary"
        aria-hidden
      />
    </span>
  );
}
