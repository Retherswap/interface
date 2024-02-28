import styled from 'styled-components';

export const HideExtraSmall = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;
