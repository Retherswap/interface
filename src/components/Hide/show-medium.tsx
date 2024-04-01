import styled from 'styled-components';

export const ShowMedium = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: unset;
  `};
`;
