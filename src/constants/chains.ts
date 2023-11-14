import { Bech32Address } from '@keplr-wallet/cosmos'
import { ChainInfoID } from 'types/enums/wallet'

export const CHAINS: ChainInfos = {
  [ChainInfoID.Osmosis1]: {
    rpc: 'https://rpc.osmosis.zone',
    rest: 'https://lcd.osmosis.zone',
    explorer: 'https://www.mintscan.io/osmosis',
    explorerName: 'Mintscan',
    chainId: ChainInfoID.Osmosis1,
    name: 'Osmosis',
    gasPrice: '0.025uosmo',
    bech32Config: Bech32Address.defaultBech32Config('osmo'),
    defaultCurrency: {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
      gasPriceStep: {
        low: 0,
        average: 0.025,
        high: 0.04,
      },
    },
    features: ['ibc-transfer', 'ibc-go'],
  },
  [ChainInfoID.OsmosisDevnet]: {
    rpc: 'https://rpc.devnet.osmosis.zone',
    rest: '	https://lcd.devnet.osmosis.zone',
    explorer: 'https://www.mintscan.io/osmosis',
    explorerName: 'Mintscan',
    chainId: ChainInfoID.OsmosisDevnet,
    name: 'Osmosis Devnet',
    gasPrice: '0.025uosmo',
    bech32Config: Bech32Address.defaultBech32Config('osmo'),
    defaultCurrency: {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
      gasPriceStep: {
        low: 0,
        average: 0.025,
        high: 0.04,
      },
    },
    features: ['ibc-transfer', 'ibc-go'],
  },
  [ChainInfoID.Neutron1]: {
    rpc: 'https://rpc-neutron.keplr.app/',
    rest: 'https://lcd-neutron.keplr.app/',
    explorer: 'https://www.mintscan.io/neutron',
    explorerName: 'Mintscan',
    chainId: ChainInfoID.Neutron1,
    name: 'Neutron',
    gasPrice: '0.025untrn',
    bech32Config: Bech32Address.defaultBech32Config('neutron'),
    defaultCurrency: {
      coinDenom: 'NTRN',
      coinMinimalDenom: 'untrn',
      coinDecimals: 6,
      coinGeckoId: 'neutron',
      gasPriceStep: {
        low: 0,
        average: 0.025,
        high: 0.04,
      },
    },
    features: ['ibc-transfer', 'ibc-go'],
  },
  [ChainInfoID.NeutronTestnet]: {
    rpc: 'https://rpc-palvus.pion-1.ntrn.tech/',
    rest: 'https://rest-palvus.pion-1.ntrn.tech/',
    explorer: 'https://testnet.mintscan.io/neutron-testnet',
    explorerName: 'Mintscan',
    chainId: ChainInfoID.NeutronTestnet,
    name: 'Neutron Testnet',
    gasPrice: '0.025untrn',
    bech32Config: Bech32Address.defaultBech32Config('neutron'),
    defaultCurrency: {
      coinDenom: 'NTRN',
      coinMinimalDenom: 'untrn',
      coinDecimals: 6,
      coinGeckoId: 'neutron',
      gasPriceStep: {
        low: 0,
        average: 0.025,
        high: 0.04,
      },
    },
    features: ['ibc-transfer', 'ibc-go'],
  },
}
