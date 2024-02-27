export function formatNumber(value: number | string | undefined): string {
  if (!value) return '0';
  if (typeof value === 'string') {
    value = Number(value);
  }
  if (value < 1) {
    let formattedPrice = value.toString();
    let index = formattedPrice.indexOf('.') + 1;
    while (
      index < formattedPrice.length &&
      (formattedPrice[index] === '0' || index < formattedPrice.indexOf('.') + 1)
    ) {
      ++index;
    }
    formattedPrice = formattedPrice.slice(0, index + 2);
    return `${formattedPrice}`;
  }
  if (value < 1000) {
    return value.toFixed(2);
  }
  if (value < 1000000) {
    return (value / 1000).toFixed(2) + 'K';
  }
  if (value < 1000000000) {
    return (value / 1000000).toFixed(2) + 'M';
  }
  if (value < 1000000000000) {
    return (value / 1000000000).toFixed(2) + 'B';
  }
  return (value / 1000000000000).toFixed(2) + 'T';
}
