import styled from 'styled-components';

export const TokenPairListGrid = styled.div`
  display: grid;
  grid-template-columns: 20px 3.5fr repeat(3, 1fr);
  align-items: center;
  gap: 0.8em;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 20px 3.5fr 1fr;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 3.5fr 1fr;
  `};
`;
