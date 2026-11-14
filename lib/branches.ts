/**
 * The Mieflow websites: the central e-commerce site and its branches.
 * Pure data + helpers (no React / browser imports), so they are unit-tested. The cards live in components/screens/settings.tsx.
 */
export type BranchId = 'pusat' | 'cabang-1' | 'cabang-2';

export type Branch = { id: BranchId; name: string; note: string; url: string };

export const BRANCHES: Branch[] = [
  { id: 'pusat', name: 'E-Commerce Pusat', note: 'Website pusat', url: 'https://legendary-tribble-eta.vercel.app/' },
  { id: 'cabang-1', name: 'Cabang 1', note: 'Website cabang pertama', url: 'https://fictional-octo-tribble-delta.vercel.app/' },
  { id: 'cabang-2', name: 'Cabang 2', note: 'Website cabang kedua', url: 'https://expert-system-azure.vercel.app/' },
];

/** "https://expert-system-azure.vercel.app/" -> "expert-system-azure.vercel.app". Returns '' for anything that is not a URL. */
export const hostOf = (url: unknown): string => {
  try {
    return new URL(String(url ?? '')).hostname.toLowerCase();
  } catch {
    return '';
  }
};

/** The branch whose website is open right now (`window.location.hostname`), or null (localhost, a custom domain, ...). */
export function currentBranch(hostname: unknown, branches: Branch[] = BRANCHES): Branch | null {
  const host = String(hostname ?? '').trim().toLowerCase();
  if (!host) return null;
  return branches.find((b) => hostOf(b.url) === host) || null;
}

/** "https://expert-system-azure.vercel.app/x" -> "https://expert-system-azure.vercel.app". Returns '' for anything that is not an http(s) URL. */
export const originOf = (url: unknown): string => {
  try {
    const u = new URL(String(url ?? ''));
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.origin : '';
  } catch {
    return '';
  }
};

/** Each distinct origin once; used by app/layout.tsx so the browser opens the connection to every branch before anyone taps it. */
export const branchOrigins = (branches: Branch[] = BRANCHES): string[] =>
  Array.from(new Set(branches.map((b) => originOf(b.url)).filter(Boolean)));

/**
 * How a branch link opens. Same tab by default: the browser keeps the current page on screen until the branch answers,
 * so there is no blank / black new tab. While an order is open in the cashier it must go in a new tab instead, because the
 * cart only lives in this tab (and its stock is already reserved in the database): leaving the page would throw it away.
 */
export const branchLinkTarget = (hasOpenOrder: boolean): '_self' | '_blank' => (hasOpenOrder ? '_blank' : '_self');
