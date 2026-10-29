import { useEffect, useState } from 'react';
import { api } from './api';
import type { Portfolio } from './types';

/** Loads a public portfolio: the owner's when slug is undefined */
export function usePortfolio(slug?: string) {
  const [data, setData] = useState<Portfolio | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setData(null);
    setError('');
    api<Portfolio>(slug ? `/portfolio/${encodeURIComponent(slug)}` : '/portfolio')
      .then((p) => alive && setData(p))
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [slug]);

  return { data, error };
}
