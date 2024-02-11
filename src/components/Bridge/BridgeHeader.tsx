import React from 'react';
import styled from 'styled-components';
import Settings from '../Settings';
import { RowBetween } from '../Row';
import { TYPE } from '../../theme';
const StyledBridgeHeader = styled.div`
  position: relative;
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: 0rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`;

export default function BridgeHeader() {
  return (
    <StyledBridgeHeader>
      <RowBetween>
        <TYPE.black fontWeight={500}>Bridge</TYPE.black>
        <Settings />
      </RowBetween>
    </StyledBridgeHeader>
  );
}
