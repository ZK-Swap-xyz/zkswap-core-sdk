import { Token } from './token'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MUMBAI = 80001,
  BSCTESTNET = 97,
  BSCMAINNET = 56,
  AVAXTESTNET = 43113,
  AVAXMAINNET = 43114,
  FANTOM = 250,
  CRONOSTESTNET = 338,
  CRONOS = 25,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 421611,
  BTTC = 199,
  VELAS = 106,
  AURORA = 1313161554,
  OASIS = 42262,
  OPTIMISM = 10,
  ETHW = 10001,
  ZKSYNCTESTNET = 280,
}

export const WETH = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.ETHW]: new Token(ChainId.ETHW, '0x7Bf88d2c0e32dE92CdaF2D43CcDc23e8Edfd5990', 18, 'WETHW', 'Wrapped ETHPoW'),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0x48f6D7dAE56623Dde5a0D56B283165cAE1753D70', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.MATIC]: new Token(
    ChainId.MATIC,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped Matic'
  ),
  [ChainId.MUMBAI]: new Token(
    ChainId.MUMBAI,
    '0x19395624C030A11f58e820C3AeFb1f5960d9742a',
    18,
    'WMATIC',
    'Wrapped Matic'
  ),
  [ChainId.BSCTESTNET]: new Token(
    ChainId.BSCTESTNET,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'WBNB',
    'Wrapped BNB'
  ),
  [ChainId.BSCMAINNET]: new Token(
    ChainId.BSCMAINNET,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB'
  ),
  [ChainId.AVAXTESTNET]: new Token(
    ChainId.AVAXTESTNET,
    '0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3',
    18,
    'WAVAX',
    'Wrapped AVAX'
  ),
  [ChainId.AVAXMAINNET]: new Token(
    ChainId.AVAXMAINNET,
    '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    18,
    'WAVAX',
    'Wrapped AVAX'
  ),
  [ChainId.FANTOM]: new Token(
    ChainId.FANTOM,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    18,
    'WFTM',
    'Wrapped Fantom'
  ),
  [ChainId.CRONOSTESTNET]: new Token(
    ChainId.CRONOSTESTNET,
    '0x1A46dCaC1d91F1731574BEfAEDaC4E0392726e35',
    18,
    'WCRO',
    'Wrapped CRO'
  ),
  [ChainId.CRONOS]: new Token(ChainId.CRONOS, '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23', 18, 'WCRO', 'Wrapped CRO'),

  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.ARBITRUM_TESTNET]: new Token(
    ChainId.ARBITRUM_TESTNET,
    '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.BTTC]: new Token(
    ChainId.BTTC,
    '0x8D193c6efa90BCFf940A98785d1Ce9D093d3DC8A',
    18,
    'WBTT',
    'Wrapped BitTorrent'
  ),
  [ChainId.VELAS]: new Token(ChainId.VELAS, '0xc579D1f3CF86749E05CD06f7ADe17856c2CE3126', 18, 'WVLX', 'Wrapped VLX'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB', 18, 'WETH', 'Wrapped ETH'),
  [ChainId.OASIS]: new Token(ChainId.OASIS, '0x21C718C22D52d0F3a789b752D4c2fD5908a8A733', 18, 'WROSE', 'Wrapped ROSE'),
  [ChainId.OPTIMISM]: new Token(
    ChainId.OPTIMISM,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.ZKSYNCTESTNET]: new Token(
      ChainId.ZKSYNCTESTNET,
      '0x33F1FBe337A19BebCa41a3DCbA896752729286Ea',
      18,
      'WETH',
      'Wrapped ETH'
  ),
}
