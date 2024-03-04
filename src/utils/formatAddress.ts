export function formatAddress(value: string | undefined, start: number = 6, end: number = 4): string {
  if (value === undefined) {
    return '';
  }
  return `${value.slice(0, start)}...${value.slice(-end, value.length)}`;
}
