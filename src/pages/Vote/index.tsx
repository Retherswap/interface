import React from 'react';
import { AutoColumn } from '../../components/Column';
import styled from 'styled-components';
import { Fonts, ExternalLink } from '../../theme';
import { RowBetween, RowFixed } from '../../components/Row';
import { Link } from 'react-router-dom';
import { ProposalStatus } from './styled';
import { ButtonPrimary } from '../../components/Button';
import { Button } from 'rebass/styled-components';
import { darken } from 'polished';
import { CardSection, DataCard, CardNoise } from '../../components/earn/styled';
import { useAllProposalData, ProposalData, useUserVotes, useUserDelegatee } from '../../state/governance/hooks';
import DelegateModal from '../../components/vote/DelegateModal';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { RETHER, ZERO_ADDRESS } from '../../constants';
import { JSBI, TokenAmount, ChainId } from '@retherswap/sdk';
import { shortenAddress, getEtherscanLink } from '../../utils';
import Loader from '../../components/Loader';
import FormattedCurrencyAmount from '../../components/FormattedCurrencyAmount';
import { useModalOpen, useToggleDelegateModal } from '../../state/application/hooks';
import { ApplicationModal } from '../../state/application/actions';

const PageWrapper = styled(AutoColumn)`
  position: relative;
  max-width: 550px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90%;
    max-width: 400px;
  `}
`;

const TopSection = styled(AutoColumn)`
  max-width: 550px;
  width: 100%;
`;

const Proposal = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  &:focus {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
`;

const ProposalNumber = styled.span`
  opacity: 0.6;
`;

const ProposalTitle = styled.span`
  font-weight: 600;
`;

const VoteCard = styled(DataCard)`
  background-color: ${({ theme }) => theme.blue2};
  overflow: hidden;
`;

const WrapSmall = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
  
  `};
`;

const TextButton = styled(Fonts.main)`
  color: ${({ theme }) => theme.primary1};
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const AddressButton = styled.div`
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 2px 4px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledExternalLink = styled(ExternalLink)`
  color: ${({ theme }) => theme.text1};
`;

const EmptyProposals = styled.div`
  border: 0px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 1rem;
`;

export default function Vote() {
  const { account, chainId } = useActiveWeb3React();

  // toggle for showing delegation modal
  const showDelegateModal = useModalOpen(ApplicationModal.DELEGATE);
  const toggleDelegateModal = useToggleDelegateModal();

  // get data to list all proposals
  const allProposals: ProposalData[] = useAllProposalData();

  // user data
  const availableVotes: TokenAmount | undefined = useUserVotes();
  const rethersBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    chainId ? RETHER[chainId] : undefined
  );
  const userDelegatee: string | undefined = useUserDelegatee();

  // show delegation option if they have have a balance, but have not delegated
  const showUnlockVoting = Boolean(
    rethersBalance && JSBI.notEqual(rethersBalance.raw, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
  );

  return (
    <PageWrapper gap="lg" justify="center">
      <DelegateModal
        isOpen={showDelegateModal}
        onDismiss={toggleDelegateModal}
        title={showUnlockVoting ? 'Unlock Votes' : 'Update Delegation'}
      />
      <TopSection gap="md">
        <VoteCard>
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <Fonts.white fontWeight={600}>Retherswap Governance</Fonts.white>
              </RowBetween>
              <RowBetween>
                <Fonts.white fontSize={14}>
                  RETHER tokens represent voting shares in Retherswap governance. You can vote on each proposal yourself
                  or delegate your votes to a third party.
                </Fonts.white>
              </RowBetween>
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://retherswap.org/governance"
                target="_blank"
              >
                <Fonts.white fontSize={14}>Read more about Retherswap governance</Fonts.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardNoise />
        </VoteCard>
      </TopSection>
      <TopSection gap="2px">
        <WrapSmall>
          <Fonts.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>Proposals</Fonts.mediumHeader>
          {(!allProposals || allProposals.length === 0) && !availableVotes && <Loader />}
          {showUnlockVoting ? (
            <ButtonPrimary
              style={{ width: 'fit-content' }}
              padding="8px"
              borderRadius="8px"
              onClick={toggleDelegateModal}
            >
              Unlock Voting
            </ButtonPrimary>
          ) : availableVotes && JSBI.notEqual(JSBI.BigInt(0), availableVotes?.raw) ? (
            <Fonts.body fontWeight={500} mr="6px">
              <FormattedCurrencyAmount currencyAmount={availableVotes} /> Votes
            </Fonts.body>
          ) : rethersBalance &&
            userDelegatee &&
            userDelegatee !== ZERO_ADDRESS &&
            JSBI.notEqual(JSBI.BigInt(0), rethersBalance?.raw) ? (
            <Fonts.body fontWeight={500} mr="6px">
              <FormattedCurrencyAmount currencyAmount={rethersBalance} /> Votes
            </Fonts.body>
          ) : (
            ''
          )}
        </WrapSmall>
        {!showUnlockVoting && (
          <RowBetween>
            <div />
            {userDelegatee && userDelegatee !== ZERO_ADDRESS ? (
              <RowFixed>
                <Fonts.body fontWeight={500} mr="4px">
                  Delegated to:
                </Fonts.body>
                <AddressButton>
                  <StyledExternalLink
                    href={getEtherscanLink(ChainId.HYPRA, userDelegatee, 'address')}
                    style={{ margin: '0 4px' }}
                  >
                    {userDelegatee === account ? 'Self' : shortenAddress(userDelegatee)}
                  </StyledExternalLink>
                  <TextButton onClick={toggleDelegateModal} style={{ marginLeft: '4px' }}>
                    (edit)
                  </TextButton>
                </AddressButton>
              </RowFixed>
            ) : (
              ''
            )}
          </RowBetween>
        )}
        {allProposals?.length === 0 && (
          <EmptyProposals>
            <Fonts.body style={{ marginBottom: '8px' }}>No proposals found.</Fonts.body>
            <Fonts.subHeader>
              <i>Proposals submitted by community members will appear here.</i>
            </Fonts.subHeader>
          </EmptyProposals>
        )}
        {allProposals?.map((p: ProposalData, i) => {
          return (
            <Proposal as={Link} to={'/vote/' + p.id} key={i}>
              <ProposalNumber>{p.id}</ProposalNumber>
              <ProposalTitle>{p.title}</ProposalTitle>
              <ProposalStatus status={p.status}>{p.status}</ProposalStatus>
            </Proposal>
          );
        })}
      </TopSection>
      <Fonts.subHeader color="text6">
        A minimum threshhold of 1% of the total RETHER supply is required to submit proposals
      </Fonts.subHeader>
    </PageWrapper>
  );
}
