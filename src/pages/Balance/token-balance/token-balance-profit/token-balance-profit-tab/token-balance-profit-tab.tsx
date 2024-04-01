import React from 'react';
import styled from 'styled-components';

const ProfitTabContainer = styled.div<{ active: boolean }>`
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4em 1em;
  border-radius: 5px;
  width: 100%;
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text3)};
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`;

const ProfitTabTitle = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

export class ProfitTab {
  public constructor(public name: string, public title: string, public description: string, public value: string) {}
}

export default function TokenBalanceProfitTab({
  tab,
  active,
  onClick,
}: {
  tab: ProfitTab;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <ProfitTabContainer active={active ?? false} onClick={() => onClick()}>
      <ProfitTabTitle>{tab.name}</ProfitTabTitle>
    </ProfitTabContainer>
  );
}
