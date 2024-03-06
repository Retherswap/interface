import React from 'react';
import styled from 'styled-components';

const BalanceWrapper = styled.div`
  padding: 0.5em;
  gap: 0.5em;
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 212px);
`;

const BalanceContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  width: 100%;
  padding: 2em 0;
  box-shadow: 0 0 10px skyblue;
  border-radius: 15px;
  height: 100%;
  background: ${({ theme }) => theme.bg1};
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export default function Balance(children: { children: React.ReactNode }) {
  return (
    <BalanceWrapper>
      <BalanceContainer>{children.children}</BalanceContainer>
    </BalanceWrapper>
  );
}
