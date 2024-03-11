import { ButtonPrimary } from 'components/Button';
import { RowBetween } from 'components/Row';
import React from 'react';
import { Trash } from 'react-feather';

export default function TokenExcludedSupplyAddress({
  excludedSupplyAddress,
  onUpdate,
  onDelete,
}: {
  excludedSupplyAddress: any;
  onUpdate: (excludedSupplyAddress: any) => void;
  onDelete: (excludedSupplyAddress: any) => void;
}) {
  return (
    <RowBetween style={{ gap: '1.5em' }}>
      <input
        style={{ width: '100%' }}
        placeholder="Enter wallet address here..."
        value={excludedSupplyAddress.address.address}
        onChange={(e) => onUpdate({ ...excludedSupplyAddress, address: { address: e.target.value } })}
      ></input>
      <ButtonPrimary
        onClick={() => onDelete(excludedSupplyAddress)}
        style={{ backgroundColor: 'red', padding: '0.5em 1em', width: 'auto', borderRadius: '10px' }}
      >
        <Trash></Trash>
        Delete
      </ButtonPrimary>
    </RowBetween>
  );
}
