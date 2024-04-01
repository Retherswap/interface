import styled from 'styled-components';

export const ShowUltraSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToUltraSmall`
    display: unset;
  `};
`;
