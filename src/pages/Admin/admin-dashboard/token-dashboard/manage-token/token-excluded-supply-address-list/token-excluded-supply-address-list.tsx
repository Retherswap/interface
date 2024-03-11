import { ButtonPrimary } from 'components/Button';
import { RowBetween } from 'components/Row';
import { ExcludedSupplyAddresses } from 'models/schema';
import React, { useCallback } from 'react';
import { Plus } from 'react-feather';
import styled from 'styled-components';
import { Fonts } from 'theme';
import TokenExcludedSupplyAddress from './token-excluded-supply-address';

const TokenExcludedSupplyAddressListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5em;
  gap: 1.5em;
  border-radius: 10px;
  background-color: #f5f7ff;
`;

export default function TokenExcludedSupplyAddressList({
  excludedSupplyAddresses,
  setExcludedSupplyAddresses,
}: {
  excludedSupplyAddresses: Partial<any>[];
  setExcludedSupplyAddresses: (excludedSupplyAddresses: Partial<ExcludedSupplyAddresses>[]) => void;
}) {
  const createExcludedSupplyAddress = useCallback(() => {
    setExcludedSupplyAddresses([
      ...excludedSupplyAddresses,
      {
        address: {
          address: '',
        },
      },
    ]);
  }, [excludedSupplyAddresses, setExcludedSupplyAddresses]);
  return (
    <TokenExcludedSupplyAddressListContainer>
      <RowBetween>
        <Fonts.black>Excluded Supply Addresses</Fonts.black>
        <ButtonPrimary onClick={() => createExcludedSupplyAddress()} style={{ padding: '10px', width: 'auto' }}>
          <Plus></Plus>
          Add
        </ButtonPrimary>
      </RowBetween>
      {excludedSupplyAddresses.map((excludedSupplyAddress, index) => (
        <TokenExcludedSupplyAddress
          key={`excluded-supply-address-${index}`}
          excludedSupplyAddress={excludedSupplyAddress}
          onUpdate={(excludedSupplyAddress: any) => {
            setExcludedSupplyAddresses(
              excludedSupplyAddresses.map((address, i) => (i === index ? excludedSupplyAddress : address))
            );
          }}
          onDelete={(excludedSupplyAddress: any) => {
            setExcludedSupplyAddresses(excludedSupplyAddresses.filter((address) => address !== excludedSupplyAddress));
          }}
        ></TokenExcludedSupplyAddress>
      ))}
    </TokenExcludedSupplyAddressListContainer>
  );
}
