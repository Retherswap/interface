import { ChainId } from '@retherswap/sdk';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.BNB]: '0x38ce767d81de3940CFa5020B55af1A400ED4F657',
  [ChainId.MATIC]: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
  [ChainId.HYPRA]: '0xfF7c6ab8544edA530D005551Fd3143F61cEf12Eb',
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
