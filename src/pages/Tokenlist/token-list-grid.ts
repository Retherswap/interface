import styled from 'styled-components';

export const TokenListGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 20px 3fr repeat(4, 1fr);
  align-items: center;
  gap: 1em;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 20px 3fr repeat(2, 1fr);
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 20px 3fr 1fr;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  grid-template-columns: 20px 2fr 1fr;
`};
  ${({ theme }) => theme.mediaWidth.upToUltraSmall`
    grid-template-columns: 2fr 1fr;
  `};
`;
