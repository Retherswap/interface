import styled from 'styled-components';

export const TokenInfosCard = styled.div`
  display: grid;
  row-gap: 1em;
  position: relative;
  padding: 1.5rem;
  width: 100%;
  border-radius: 2rem;
  box-shadow: 0 0 10px skyblue; /* Use skyblue color for the glow */
  background: ${({ theme }) => theme.bg1};
`;
