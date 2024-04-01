import styled from 'styled-components';

export const HideLarge = styled.div`
  display: unset;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};
`;
