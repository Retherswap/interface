import styled from 'styled-components';

export const HideUltraSmall = styled.div`
  ${({ theme }) => theme.mediaWidth.upToUltraSmall`
    display: none;
  `};
`;
