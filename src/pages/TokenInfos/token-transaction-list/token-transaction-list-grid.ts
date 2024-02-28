import styled from 'styled-components';

export const TokenTransactionListGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr repeat(5, 1fr);
  align-items: center;
  gap: 1em;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  grid-template-columns: 1.5fr repeat(3, 1fr);
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
grid-template-columns: 1.5fr 1fr;
`};
`;
