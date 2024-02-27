import Column from 'components/Column';
import Row from 'components/Row';
import React from 'react';
import { ArrowDown, ArrowUp } from 'react-feather';
import { TYPE } from 'theme';

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
    <Column style={{ gap: '5px' }}>
      <TYPE.blue fontWeight={800} fontSize={13}>
        {title}
      </TYPE.blue>
      <TYPE.black fontWeight={600} fontSize={25}>
        {value}
      </TYPE.black>
      {percentChange && (
        <Row>
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
        </Row>
      )}
    </Column>
  );
}
