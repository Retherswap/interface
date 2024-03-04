import React from 'react';
import styled from 'styled-components';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import AppBody from '../AppBody';
import USDRVaultHeader from 'components/USDRVault/USDRVaultHeader';
export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`;

export default function USDRVault() {
  return (
    <>
      <SwapPoolTabs active={'swap'} />
      <AppBody>
        <USDRVaultHeader />
        <Wrapper id="usdr-vault-page"></Wrapper>
      </AppBody>
    </>
  );
}
