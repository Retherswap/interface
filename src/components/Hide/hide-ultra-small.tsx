import styled from 'styled-components';

export const HideUltraSmall = styled.div`
  display: unset;
  ${({ theme }) => theme.mediaWidth.upToUltraSmall`
    display: none;
  `};
`;
