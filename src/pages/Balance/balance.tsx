import React, { useEffect } from 'react';
import { X } from 'react-feather';
import { useDispatch } from 'react-redux';
import { setShowHeader } from 'state/application/actions';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BalanceWrapper = styled.div`
  padding: 0.5em;
  gap: 0.5em;
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 212px);
  ${({ theme }) => theme.mediaHeight.upToMedium`
  padding: unset;
  height: 100vh;
`}
`;

const CloseButton = styled(Link)`
  display: none;
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.5em;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  &:hover {
    color: ${({ theme }) => theme.text2};
  }
  ${({ theme }) => theme.mediaHeight.upToMedium`
  display: block;
`}
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
  height: 100%;
  border-radius: 15px;
  background: ${({ theme }) => theme.bg1};
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 0px;
  }
  ${({ theme }) => theme.mediaHeight.upToMedium`
  border-radius: unset;
`}
`;

export default function Balance(children: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setShowHeader(false));
    return () => {
      dispatch(setShowHeader(true));
    };
  }, [dispatch]);
  return (
    <BalanceWrapper>
      <BalanceContainer>
        <CloseButton to={'/swap'}>
          <X size={25}></X>
        </CloseButton>
        {children.children}
      </BalanceContainer>
    </BalanceWrapper>
  );
}
