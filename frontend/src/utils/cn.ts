/**
 * cn.ts — Conditional className utility
 *
 * WHY: Components often need to merge static Tailwind classes with dynamic ones.
 *      This helper filters falsy values and joins the rest.
 *
 * HOW: cn('base-class', isActive && 'active-class', className)
 *
 * ALTERNATIVE: `clsx` + `tailwind-merge` npm packages — we keep it zero-dependency for now.
 *              Add `tailwind-merge` in Phase 3 if conflicting utility classes become an issue.
 */

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
