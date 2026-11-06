export function formatEgp(value: number): string {
  return `${(value / 1_000_000).toFixed(1)}M EGP`;
}