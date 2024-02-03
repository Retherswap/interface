import { useCallback, useEffect, useState } from 'react';
import { useActiveWeb3React } from '../../hooks';
import useDebounce from '../../hooks/useDebounce';
import useIsWindowVisible from '../../hooks/useIsWindowVisible';
import { updateBlockNumber, setImplements3085, updateChainId } from './actions';
import { useDispatch } from 'react-redux';
import { ETHER } from '@retherswap/sdk';
import { ETH_NAME_AND_SYMBOL } from '../../constants';
import { switchToNetwork } from 'utils/switchToNetwork'
import { supportedChainId } from 'utils/supportedChainId'

export default function Updater(): null {
  const { account, library, chainId } = useActiveWeb3React();
  const dispatch = useDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber };
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) };
        }
        return state;
      });
    },
    [chainId, setState]
  );

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined;

    setState({ chainId, blockNumber: null });

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error));

    library.on('block', blockNumberCallback);
    return () => {
      library.removeListener('block', blockNumberCallback);
    };
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return;
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }));
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId]);

  // set proper chains native token (ETHER) name and symbol
  useEffect(() => {
    if (chainId) {
      ETHER.changeNameAndSymbol(ETH_NAME_AND_SYMBOL[chainId].name, ETH_NAME_AND_SYMBOL[chainId].symbol);
    }
  }, [chainId]);

  useEffect(() => {
    dispatch(
      updateChainId({ chainId: debouncedState.chainId ? supportedChainId(debouncedState.chainId) ?? null : null })
    )
  }, [dispatch, debouncedState.chainId])

  useEffect(() => {
    if (!account || !library?.provider?.request || !library?.provider?.isMetaMask) {
      return
    }   
    switchToNetwork({ library })
      .then((x) => x ?? dispatch(setImplements3085({ implements3085: true })))
      .catch(() => dispatch(setImplements3085({ implements3085: false })))
  }, [account, chainId, dispatch, library])

  return null
}
