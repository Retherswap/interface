import styled from 'styled-components';

export const ShowExtraSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: unset;
  `};
`;
