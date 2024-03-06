import React, { useCallback, useRef } from 'react';
import QRCode from 'qrcode.react';
import { useActiveWeb3React } from 'hooks';
import Modal from 'components/Modal';
import Column from 'components/Column';
import { Fonts } from 'theme';
import Row from 'components/Row';
import { Copy } from 'react-feather';

export default function DepositModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const ref = useRef<any>();
  const handleDismiss = useCallback(() => onDismiss(), [onDismiss]);
  const web3 = useActiveWeb3React();
  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <Column ref={ref} style={{ alignItems: 'center', width: '100%', padding: '1.5em', gap: '1em' }}>
        <Fonts.black fontSize={24}> Deposit </Fonts.black>
        <QRCode value={web3?.account ?? ''} size={256} level={'H'} />
        <Row
          style={{ justifyContent: 'center', gap: '5px', cursor: 'pointer' }}
          onClick={() => navigator.clipboard.writeText(web3?.account ?? '')}
        >
          <Fonts.black fontSize={12}>{web3?.account ?? ''}</Fonts.black>
          <Copy size={16}></Copy>
        </Row>
      </Column>
    </Modal>
  );
}
