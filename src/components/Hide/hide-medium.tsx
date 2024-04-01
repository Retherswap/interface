import styled from 'styled-components';

export const HideMedium = styled.div`
  display: unset;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;
