import { useMemo } from 'react';
import { useDefaultTokens } from './Tokens';

export const useCurrency = (address: string | undefined) => {
  const defaultTokens = useDefaultTokens();
  return useMemo(() => {
    return defaultTokens[Object.keys(defaultTokens).find((key) => key.toLowerCase() === address?.toLowerCase()) ?? ''];
  }, [defaultTokens, address]);
};
