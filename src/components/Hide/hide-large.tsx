import styled from 'styled-components';

export const HideLarge = styled.div`
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};
`;
