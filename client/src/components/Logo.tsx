/** Brand mark: three linked nodes (echoing the background network) beside the person's initials */
export function Logo({ initials, name }: { initials: string; name?: string }) {
  return (
    <span className="logo">
      <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="9" fill="#0A1828" stroke="rgba(165,243,252,0.35)" />
        <path d="M9 21 L16 10 L23 21 Z" fill="none" stroke="#178582" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="16" cy="10" r="3" fill="#00FFFF" />
        <circle cx="9" cy="21" r="2.6" fill="#a5f3fc" />
        <circle cx="23" cy="21" r="2.6" fill="#BFA181" />
      </svg>
      <span className="logo__text">
        <span className="logo__initials">{initials}</span>
        {name && <span className="logo__name">{name}</span>}
      </span>
    </span>
  );
}
