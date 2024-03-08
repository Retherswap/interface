import { createReducer, nanoid } from '@reduxjs/toolkit';
import {
  addPopup,
  PopupContent,
  removePopup,
  updateBlockNumber,
  ApplicationModal,
  setOpenModal,
  setImplements3085,
  setNativeToken,
  setShowHeader,
} from './actions';
import { TokenModel } from 'models/TokenModel';

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>;

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number };
  readonly popupList: PopupList;
  readonly openModal: ApplicationModal | null;
  readonly implements3085: boolean;
  readonly nativeToken: TokenModel | undefined;
  readonly showHeader: boolean;
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
  openModal: null,
  implements3085: false,
  nativeToken: undefined,
  showHeader: true,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setNativeToken, (state, { payload: token }) => {
      state.nativeToken = token;
    })
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload;
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId]);
      }
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload;
    })
    .addCase(setShowHeader, (state, action) => {
      state.showHeader = action.payload;
    })
    .addCase(setImplements3085, (state, { payload: { implements3085 } }) => {
      state.implements3085 = implements3085;
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ]);
    })
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false;
        }
      });
    })
);
