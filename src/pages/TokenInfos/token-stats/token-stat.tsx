import Column from 'components/Column';
import Row from 'components/Row';
import React from 'react';
import { ArrowDown, ArrowUp } from 'react-feather';
import styled from 'styled-components';
import { TYPE } from 'theme';

const Stat = styled.div`
  display: flex;
  gap: 5px;
  user-select: none;
  align-items: bottom;
`;

export default function TokenStat({
  title,
  value,
  percentChange,
}: {
  title: string;
  value: string;
  percentChange?: number | undefined;
}) {
  return (
    <Stat>
      <Column style={{ gap: '5px', width: '100%' }}>
        <TYPE.blue fontWeight={800} fontSize={13}>
          {title}
        </TYPE.blue>
        <Row style={{ width: '100%', justifyContent: 'space-between' }}>
          <TYPE.black fontWeight={600} fontSize={25}>
            {value}
          </TYPE.black>
          {percentChange && (
            <div style={{ display: 'flex' }}>
              {percentChange > 0 ? (
                <>
                  <TYPE.green>
                    <ArrowUp size={'15px'}></ArrowUp>
                  </TYPE.green>
                  <TYPE.green fontWeight={500} fontSize={15}>
                    {percentChange}%
                  </TYPE.green>
                </>
              ) : (
                <>
                  <TYPE.red>
                    <ArrowDown size={'15px'}></ArrowDown>
                  </TYPE.red>
                  <TYPE.red fontWeight={500} fontSize={15}>
                    {Math.abs(percentChange)}%
                  </TYPE.red>
                </>
              )}
            </div>
          )}
        </Row>
      </Column>
    </Stat>
  );
}
