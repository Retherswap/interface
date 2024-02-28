import styled from 'styled-components';

export const HideMedium = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;
