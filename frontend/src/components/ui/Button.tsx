/**
 * Button.tsx — Premium CTA button (PrimeReact + Tailwind)
 *
 * WHY: Wraps PrimeReact Button with PortfolioOS variants — consistent CTAs in Hero, forms, admin.
 *
 * VARIANTS:
 * - primary   → filled blue (main action)
 * - secondary → outlined glass (secondary action)
 * - ghost     → text only (tertiary)
 *
 * Supports internal routes (React Router) and external hrefs.
 */

import { Button as PrimeButton } from 'primereact/button';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  href?: string;
  icon?: string;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: '!bg-primary !border-primary hover:!bg-primary-hover shadow-glow',
  secondary: '!bg-transparent !border-border !text-text hover:!bg-white/5',
  ghost: '!bg-transparent !border-transparent !text-muted hover:!text-text',
};

export function Button({
  label,
  href,
  icon,
  variant = 'primary',
  external = false,
  className,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const classes = cn(
    '!rounded-xl !px-5 !py-2.5 !text-sm !font-medium !transition-all',
    variantClasses[variant],
    className,
  );

  /** External link */
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex">
        <PrimeButton label={label} icon={icon} className={classes} disabled={disabled} />
      </a>
    );
  }

  /** Internal route */
  if (href && !external) {
    return (
      <Link to={href} className="inline-flex no-underline">
        <PrimeButton label={label} icon={icon} className={classes} disabled={disabled} />
      </Link>
    );
  }

  return (
    <PrimeButton
      label={label}
      icon={icon}
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
    />
  );
}
