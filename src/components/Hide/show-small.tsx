import styled from 'styled-components';

export const ShowSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`;
