import React from 'react';
import styled from 'styled-components';

const Spacing = styled.div`
  position: relative;
  max-width: 550px;
  padding: 0.4em;
  width: 100%;
`;

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 550px;
  width: 100%;
  margin-top: 2em;
  padding: 0.5rem;
  border-radius: 2rem;
  box-shadow: 0 0 10px skyblue; /* Use skyblue color for the glow */
  background: ${({ theme }) => theme.bg1};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    max-width: 500px;
    padding: 0rem;
  `}
`;

export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <Spacing>
      <BodyWrapper>{children}</BodyWrapper>
    </Spacing>
  );
}
