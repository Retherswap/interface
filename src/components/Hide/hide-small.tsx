import styled from 'styled-components';

export const HideSmall = styled.div`
  display: unset;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;
