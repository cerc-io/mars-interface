// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { StdFee } from '@cosmjs/amino'
import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import {
  ArrayOfCoin,
  ArrayOfCoinBalanceResponseItem,
  ArrayOfDebtShares,
  ArrayOfLentShares,
  ArrayOfSharesResponseItem,
  ArrayOfString,
  ArrayOfVaultInfoResponse,
  ArrayOfVaultPositionResponseItem,
  ArrayOfVaultWithBalance,
  Coin,
  ConfigResponse,
  DebtShares,
  HealthResponse,
  LentShares,
  Positions,
  Uint128,
  VaultBaseForString,
} from './MarsMockCreditManager.types'
export interface MarsMockCreditManagerReadOnlyInterface {
  contractAddress: string
  config: () => Promise<ConfigResponse>
  vaultsInfo: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: VaultBaseForString
  }) => Promise<ArrayOfVaultInfoResponse>
  allowedCoins: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string
  }) => Promise<ArrayOfString>
  positions: ({ accountId }: { accountId: string }) => Promise<Positions>
  health: ({ accountId }: { accountId: string }) => Promise<HealthResponse>
  allCoinBalances: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string[][]
  }) => Promise<ArrayOfCoinBalanceResponseItem>
  allDebtShares: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string[][]
  }) => Promise<ArrayOfSharesResponseItem>
  totalDebtShares: () => Promise<DebtShares>
  allTotalDebtShares: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string
  }) => Promise<ArrayOfDebtShares>
  allLentShares: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string[][]
  }) => Promise<ArrayOfSharesResponseItem>
  totalLentShares: () => Promise<LentShares>
  allTotalLentShares: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string
  }) => Promise<ArrayOfLentShares>
  allVaultPositions: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string[][]
  }) => Promise<ArrayOfVaultPositionResponseItem>
  totalVaultCoinBalance: ({ vault }: { vault: VaultBaseForString }) => Promise<Uint128>
  allTotalVaultCoinBalances: ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: VaultBaseForString
  }) => Promise<ArrayOfVaultWithBalance>
  estimateProvideLiquidity: ({
    coinsIn,
    lpTokenOut,
  }: {
    coinsIn: Coin[]
    lpTokenOut: string
  }) => Promise<Uint128>
  estimateWithdrawLiquidity: ({ lpToken }: { lpToken: Coin }) => Promise<ArrayOfCoin>
}
export class MarsMockCreditManagerQueryClient implements MarsMockCreditManagerReadOnlyInterface {
  client: CosmWasmClient
  contractAddress: string

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client
    this.contractAddress = contractAddress
    this.config = this.config.bind(this)
    this.vaultsInfo = this.vaultsInfo.bind(this)
    this.allowedCoins = this.allowedCoins.bind(this)
    this.positions = this.positions.bind(this)
    this.health = this.health.bind(this)
    this.allCoinBalances = this.allCoinBalances.bind(this)
    this.allDebtShares = this.allDebtShares.bind(this)
    this.totalDebtShares = this.totalDebtShares.bind(this)
    this.allTotalDebtShares = this.allTotalDebtShares.bind(this)
    this.allLentShares = this.allLentShares.bind(this)
    this.totalLentShares = this.totalLentShares.bind(this)
    this.allTotalLentShares = this.allTotalLentShares.bind(this)
    this.allVaultPositions = this.allVaultPositions.bind(this)
    this.totalVaultCoinBalance = this.totalVaultCoinBalance.bind(this)
    this.allTotalVaultCoinBalances = this.allTotalVaultCoinBalances.bind(this)
    this.estimateProvideLiquidity = this.estimateProvideLiquidity.bind(this)
    this.estimateWithdrawLiquidity = this.estimateWithdrawLiquidity.bind(this)
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    })
  }
  vaultsInfo = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: VaultBaseForString
  }): Promise<ArrayOfVaultInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      vaults_info: {
        limit,
        start_after: startAfter,
      },
    })
  }
  allowedCoins = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string
  }): Promise<ArrayOfString> => {
    return this.client.queryContractSmart(this.contractAddress, {
      allowed_coins: {
        limit,
        start_after: startAfter,
      },
    })
  }
  positions = async ({ accountId }: { accountId: string }): Promise<Positions> => {
    return this.client.queryContractSmart(this.contractAddress, {
      positions: {
        account_id: accountId,
      },
    })
  }
  health = async ({ accountId }: { accountId: string }): Promise<HealthResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      health: {
        account_id: accountId,
      },
    })
  }
  allCoinBalances = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string[][]
  }): Promise<ArrayOfCoinBalanceResponseItem> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_coin_balances: {
        limit,
        start_after: startAfter,
      },
    })
  }
  allDebtShares = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string[][]
  }): Promise<ArrayOfSharesResponseItem> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_debt_shares: {
        limit,
        start_after: startAfter,
      },
    })
  }
  totalDebtShares = async (): Promise<DebtShares> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_debt_shares: {},
    })
  }
  allTotalDebtShares = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string
  }): Promise<ArrayOfDebtShares> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_total_debt_shares: {
        limit,
        start_after: startAfter,
      },
    })
  }
  allLentShares = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string[][]
  }): Promise<ArrayOfSharesResponseItem> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_lent_shares: {
        limit,
        start_after: startAfter,
      },
    })
  }
  totalLentShares = async (): Promise<LentShares> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_lent_shares: {},
    })
  }
  allTotalLentShares = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string
  }): Promise<ArrayOfLentShares> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_total_lent_shares: {
        limit,
        start_after: startAfter,
      },
    })
  }
  allVaultPositions = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: string[][]
  }): Promise<ArrayOfVaultPositionResponseItem> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_vault_positions: {
        limit,
        start_after: startAfter,
      },
    })
  }
  totalVaultCoinBalance = async ({ vault }: { vault: VaultBaseForString }): Promise<Uint128> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_vault_coin_balance: {
        vault,
      },
    })
  }
  allTotalVaultCoinBalances = async ({
    limit,
    startAfter,
  }: {
    limit?: number
    startAfter?: VaultBaseForString
  }): Promise<ArrayOfVaultWithBalance> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_total_vault_coin_balances: {
        limit,
        start_after: startAfter,
      },
    })
  }
  estimateProvideLiquidity = async ({
    coinsIn,
    lpTokenOut,
  }: {
    coinsIn: Coin[]
    lpTokenOut: string
  }): Promise<Uint128> => {
    return this.client.queryContractSmart(this.contractAddress, {
      estimate_provide_liquidity: {
        coins_in: coinsIn,
        lp_token_out: lpTokenOut,
      },
    })
  }
  estimateWithdrawLiquidity = async ({ lpToken }: { lpToken: Coin }): Promise<ArrayOfCoin> => {
    return this.client.queryContractSmart(this.contractAddress, {
      estimate_withdraw_liquidity: {
        lp_token: lpToken,
      },
    })
  }
}
export interface MarsMockCreditManagerInterface extends MarsMockCreditManagerReadOnlyInterface {
  contractAddress: string
  sender: string
  setHealthResponse: (
    {
      accountId,
      response,
    }: {
      accountId: string
      response: HealthResponse
    },
    fee?: number | StdFee | 'auto',
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>
}
export class MarsMockCreditManagerClient
  extends MarsMockCreditManagerQueryClient
  implements MarsMockCreditManagerInterface
{
  client: SigningCosmWasmClient
  sender: string
  contractAddress: string

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress)
    this.client = client
    this.sender = sender
    this.contractAddress = contractAddress
    this.setHealthResponse = this.setHealthResponse.bind(this)
  }

  setHealthResponse = async (
    {
      accountId,
      response,
    }: {
      accountId: string
      response: HealthResponse
    },
    fee: number | StdFee | 'auto' = 'auto',
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        set_health_response: {
          account_id: accountId,
          response,
        },
      },
      fee,
      memo,
      funds,
    )
  }
}
