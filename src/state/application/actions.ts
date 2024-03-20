import { createAction } from '@reduxjs/toolkit';
import { TokenList } from '@retherswap/token-lists';
import { Token } from 'models/schema';

export type PopupContent =
  | {
      txn: {
        hash: string;
        success: boolean;
        summary?: string;
      };
    }
  | {
      listUpdate: {
        listUrl: string;
        oldList: TokenList;
        newList: TokenList;
        auto: boolean;
      };
    };

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  DELEGATE,
  VOTE,
  NETWORK_SELECTOR,
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>(
  'application/updateBlockNumber'
);
export const updateChainId = createAction<{ chainId: number | null }>('application/updateChainId');
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal');
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addPopup'
);
export const removePopup = createAction<{ key: string }>('application/removePopup');
export const setImplements3085 = createAction<{ implements3085: boolean }>('application/setImplements3085');
export const setNativeToken = createAction<Token | undefined>('application/setNativeToken');
export const setLoginToken = createAction<string | undefined>('application/setLoginToken');
export const setIsAdmin = createAction<boolean>('application/setIsAdmin');
export const setRequestConnection = createAction<boolean>('application/setRequestConnection');
export const setShowHeader = createAction<boolean>('application/setShowHeader');
