import { useDefaultTokens } from './Tokens';

export const useCurrency = (address: string | undefined) => {
  const defaultTokens = useDefaultTokens();
  return defaultTokens[Object.keys(defaultTokens).find((key) => key.toLowerCase() === address?.toLowerCase()) ?? ''];
};
