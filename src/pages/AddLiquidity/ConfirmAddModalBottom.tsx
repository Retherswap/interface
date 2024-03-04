import { Currency, CurrencyAmount, Fraction, Percent } from '@retherswap/sdk';
import React from 'react';
import { Text } from 'rebass';
import { ButtonPrimary } from '../../components/Button';
import { RowBetween, RowFixed } from '../../components/Row';
import CurrencyLogo from '../../components/CurrencyLogo';
import { Field } from '../../state/mint/actions';
import { Fonts } from '../../theme';

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean;
  price?: Fraction;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
}) {
  return (
    <>
      <RowBetween>
        <Fonts.body>{currencies[Field.CURRENCY_A]?.symbol} Deposited</Fonts.body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <Fonts.body>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Fonts.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <Fonts.body>{currencies[Field.CURRENCY_B]?.symbol} Deposited</Fonts.body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <Fonts.body>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Fonts.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <Fonts.body>Rates</Fonts.body>
        <Fonts.body>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </Fonts.body>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <Fonts.body>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </Fonts.body>
      </RowBetween>
      <RowBetween>
        <Fonts.body>Share of Pool:</Fonts.body>
        <Fonts.body>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Fonts.body>
      </RowBetween>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
        </Text>
      </ButtonPrimary>
    </>
  );
}
