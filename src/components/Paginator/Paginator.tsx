import Row from 'components/Row';
import React from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import styled, { useTheme } from 'styled-components';
import { TYPE } from 'theme';
export const ArrowButton = styled('button')<{ disabled: boolean }>`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
`;

interface PaginatorProps {
  page: number;
  elementsPerPage: number;
  count: number;
  onPageChange: (page: number) => void;
}

export default function Paginator({ page, elementsPerPage, count, onPageChange }: Readonly<PaginatorProps>) {
  const theme = useTheme();
  const pageLength = Math.ceil(count / elementsPerPage);
  return (
    <Row style={{ width: '100%', justifyContent: 'center', gap: '1.5em' }}>
      <ArrowButton disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ArrowLeft size={20} color={page <= 1 ? 'gray' : theme.blue2}></ArrowLeft>
      </ArrowButton>
      <TYPE.blue fontWeight={500} fontSize={16}>
        Page {page} of {pageLength}
      </TYPE.blue>
      <ArrowButton disabled={page >= pageLength} onClick={() => onPageChange(page + 1)}>
        <ArrowRight size={20} color={page >= pageLength ? 'gray' : theme.blue2}></ArrowRight>
      </ArrowButton>
    </Row>
  );
}
