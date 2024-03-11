import Paginator from 'components/Paginator/Paginator';
import { adminUrl } from 'configs/server';
import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'state/hooks';
import AdminTokenDashboardRow from './token-dashboard-row';
import styled from 'styled-components';
import { SearchInput } from 'components/SearchInput/SearchInput';

const TokenDashboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  position: relative;
  padding: 1.5rem;
  width: 100%;
  max-width: 1200px;
  border-radius: 2rem;
  box-shadow: 0 0 10px skyblue; /* Use skyblue color for the glow */
  background: ${({ theme }) => theme.bg1};
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.bg3};
`;

export const RowDivider = styled(Divider)`
  height: 1px;
`;

export default function AdminTokenDashboard() {
  const elementsPerPage = 10;
  const [tokens, setTokens] = useState([]);
  const [page, setPage] = useState(1);
  const loginToken = useAppSelector((state) => state.application.loginToken);
  useEffect(() => {
    if (!loginToken) {
      return;
    }
    const fetchInfo = () => {
      return fetch(`${adminUrl}/tokens`, {
        headers: {
          Authorization: loginToken,
        },
      })
        .then((res) => res.json())
        .then((d) => setTokens(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [loginToken]);
  const [search, setSearch] = useState('');
  const filteredTokens = useMemo(() => {
    return tokens.filter((token: any) => {
      return (
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.address.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [tokens, search]);
  return (
    <div style={{ padding: '1em' }}>
      <TokenDashboardList>
        <SearchInput
          onInput={(e) => setSearch((e.target as any).value)}
          value={search}
          placeholder="Search token..."
        ></SearchInput>
        <Divider></Divider>
        {filteredTokens.slice((page - 1) * elementsPerPage, page * elementsPerPage).map((token: any, index: number) => (
          <>
            <AdminTokenDashboardRow
              key={`admin-token-dashboard-row-${token.id}`}
              token={token}
            ></AdminTokenDashboardRow>
            <RowDivider></RowDivider>
          </>
        ))}
        <Paginator
          page={page}
          elementsPerPage={elementsPerPage}
          count={filteredTokens.length}
          onPageChange={(page) => {
            setPage(page);
          }}
        ></Paginator>
      </TokenDashboardList>
    </div>
  );
}
