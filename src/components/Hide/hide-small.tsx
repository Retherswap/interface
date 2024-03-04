import styled from 'styled-components';

export const HideSmall = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;
