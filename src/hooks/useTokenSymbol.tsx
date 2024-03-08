import { Token } from 'models/schema';

export const useTokenSymbol = (token: Token | undefined) => {
  if (!token) {
    return undefined;
  }
  if (!token.isLP) {
    return token.symbol;
  }
  return token.lpPair?.token0.symbol + '-' + token.lpPair?.token1.symbol;
};
