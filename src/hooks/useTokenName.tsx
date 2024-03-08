import { Token } from 'models/schema';

export const useTokenName = (token: Token | undefined) => {
  if (!token) {
    return undefined;
  }
  if (!token.isLP) {
    return token.name;
  }
  return token.lpPair?.token0.symbol + '-' + token.lpPair?.token1.symbol + ' LP';
};
