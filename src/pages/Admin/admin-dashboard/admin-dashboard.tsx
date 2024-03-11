import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
const AdminDashboardGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
  padding: 1em;
`;

const AdminDashboardCard = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  text-decoration: none;
  color: ${({ theme }) => theme.text1};
  width: 100%;
  height: 100%;
  min-height: 200px;
  padding: 1em;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 10px skyblue; /* Use skyblue color for the glow */
  background: ${({ theme }) => theme.bg1};
  transition: background 0.4s;
  &:hover {
    background: ${({ theme }) => theme.bg3};
  }
`;

export default function AdminDashboard() {
  return (
    <AdminDashboardGrid>
      <AdminDashboardCard to={'/admin/tokens'}>Tokens</AdminDashboardCard>
    </AdminDashboardGrid>
  );
}
