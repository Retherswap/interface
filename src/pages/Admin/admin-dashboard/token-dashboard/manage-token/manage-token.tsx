import { ButtonPrimary } from 'components/Button';
import Column from 'components/Column';
import NoStyleLink from 'components/Link/no-style-link';
import Row, { RowBetween } from 'components/Row';
import Toggle from 'components/Toggle';
import { adminUrl } from 'configs/server';
import { ExcludedSupplyAddresses, Token } from 'models/schema';
import React, { useCallback, useEffect, useState } from 'react';
import { Save, X } from 'react-feather';
import { useParams } from 'react-router';
import { Fonts } from 'theme';
import TokenExcludedSupplyAddressList from './token-excluded-supply-address-list/token-excluded-supply-address-list';
import { useAppSelector } from 'state/hooks';

export default function AdminManageToken() {
  const { address } = useParams<any>();
  const [name, setName] = useState('');
  const [isListed, setIsListed] = useState(false);
  const [excludedSupplyAddresses, setExcludedSupplyAddresses] = useState<ExcludedSupplyAddresses[]>([]);
  const loginToken = useAppSelector((state) => state.application.loginToken);
  useEffect(() => {
    if (!loginToken) {
      return;
    }
    const fetchInfo = () => {
      return fetch(`${adminUrl}/tokens/address/${address}`, {
        headers: {
          Authorization: loginToken,
        },
      })
        .then((res) => res.json())
        .then((token: Token) => {
          setName(token.name);
          setIsListed(token.isListed);
          setExcludedSupplyAddresses(token.excludedSupplyAddresses ?? []);
        })
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [address, loginToken]);

  const save = useCallback(() => {
    if (!loginToken) {
      return;
    }
    fetch(`${adminUrl}/tokens/address/${address}`, {
      method: 'PUT',
      headers: {
        Authorization: loginToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        isListed: isListed,
        excludedSupplyAddresses: excludedSupplyAddresses,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.error(res.error);
          return;
        }
        console.log('Token updated');
      })
      .catch((e) => {
        console.error(e);
      });
  }, [address, excludedSupplyAddresses, isListed, loginToken, name]);
  return (
    <Column style={{ gap: '1.5em' }}>
      {address}
      <RowBetween>
        <Fonts.black>Token Name</Fonts.black>{' '}
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
      </RowBetween>
      <RowBetween>
        <Fonts.black>Is Listed</Fonts.black>
        <Toggle
          isActive={isListed}
          toggle={() => {
            setIsListed(!isListed);
          }}
        ></Toggle>
      </RowBetween>
      <TokenExcludedSupplyAddressList
        excludedSupplyAddresses={excludedSupplyAddresses}
        setExcludedSupplyAddresses={(excludedSupplyAddresses: any[]) =>
          setExcludedSupplyAddresses(excludedSupplyAddresses)
        }
      ></TokenExcludedSupplyAddressList>
      <Row style={{ gap: '10px' }}>
        <NoStyleLink to={'/admin/tokens'}>
          <ButtonPrimary style={{ backgroundColor: 'red', padding: '0.5em 1em', borderRadius: '10px' }}>
            <X> </X>
            Cancel
          </ButtonPrimary>
        </NoStyleLink>
        <ButtonPrimary onClick={() => save()} style={{ padding: '0.5em 1em', borderRadius: '10px' }}>
          <Save></Save>
          Save
        </ButtonPrimary>
      </Row>
    </Column>
  );
}
