import { BroadcastResult } from '@delphi-labs/shuttle-react'
import { getTokenValueFromCoins } from 'functions/fields'
import { useUnlockMessages } from 'hooks/queries'
import { extractCoinFromLog, parseActionMessages } from 'libs/parse'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useStore from 'store'
import { Coin } from 'types/generated/mars-credit-manager/MarsCreditManager.types'

export const useFieldsActionMessages = (
  data?: BroadcastResult,
  vault?: ActiveVault,
): {
  depositMessage?: FieldsAction
  borrowMessage?: FieldsAction
  swapMessage?: FieldsAction
  repayMessage?: FieldsAction
  unlockMessages?: FieldsAction[]
  withdrawMessage?: FieldsAction
} => {
  const whitelistedAssets = useStore((s) => s.networkConfig.assets.whitelist)
  const { t } = useTranslation()
  const [vaultTokenAmount, setVaultTokenAmount] = useState('')
  const [depositMessage, setDepositMessage] = useState<FieldsAction>()
  const [borrowMessage, setBorrowMessage] = useState<FieldsAction>()
  const [swapMessage, setSwapMessage] = useState<FieldsAction>()
  const [repayMessage, setRepayMessage] = useState<FieldsAction>()
  const [withdrawMessage, setWithdrawMessage] = useState<FieldsAction>()

  const { data: unlockMessages } = useUnlockMessages({ vault, vaultTokenAmount })

  const getDepositedCoins = useCallback((messages: unknown[]): Coin[] => {
    try {
      return (messages.filter((message: any) => message?.action === 'callback/deposit') as any).map(
        (msg: any) => extractCoinFromLog(msg.coin_deposited),
      )
    } catch {
      return []
    }
  }, [])

  const getBorrowedCoins = useCallback((messages: any[]): Coin[] => {
    try {
      return (
        messages.filter((message: any) => message?.action === 'borrow' && message?.denom) as any
      ).map((msg: any) => ({ denom: msg.denom, amount: msg.amount }))
    } catch {
      return []
    }
  }, [])

  const getSwapCoinIn = useCallback((messages: unknown[]): Coin | null => {
    try {
      return (messages.filter((message: any) => message?.action === 'swap_fn') as any).map(
        (msg: any) => ({ denom: msg.denom_in, amount: msg.amount_in }),
      )[0]
    } catch {
      return null
    }
  }, [])

  const getSwapCoinOut = useCallback((messages: unknown[]): Coin | null => {
    try {
      const coinsSwapOutIndex = messages.findIndex(
        (message: any) => message?.action === 'transfer_result',
      ) as any

      const msg: any = messages[coinsSwapOutIndex + 1]

      const coin = extractCoinFromLog(msg.coin_incremented)

      return { denom: coin.denom, amount: coin.amount }
    } catch {
      return null
    }
  }, [])

  const getRepayCoin = useCallback((messages: any[]): Coin | null => {
    try {
      return messages
        .filter((message: any) => message?.action === ('repay' as any) && message?.denom)
        .map((msg: any) => {
          return { denom: msg.denom, amount: msg.amount }
        })[0]
    } catch {
      return null
    }
  }, [])

  const getWithdrawnCoins = useCallback((messages: any[]): Coin[] => {
    try {
      return (
        messages.filter((message: any) => message?.action === 'callback/withdraw') as any
      ).map((msg: any) => {
        return extractCoinFromLog(msg.coin_withdrawn)
      })
    } catch {
      return []
    }
  }, [])

  const getVaultUnlockAmount = useCallback((messages: any[]): string | null => {
    try {
      return (
        messages.filter((message: any) => message?.action === 'vault/request_unlock') as any
      ).map((msg: any) => {
        return msg.unlock_amount
      })[0]
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!data) {
      return
    }

    const messages = parseActionMessages(data)
    if (!messages?.length) {
      return
    }

    const depositedCoins = getDepositedCoins(messages)
    const borrowedCoins = getBorrowedCoins(messages)
    const swapCoinIn = getSwapCoinIn(messages)
    const swapCoinOut = getSwapCoinOut(messages)
    const repayCoin = getRepayCoin(messages)
    const withdrawnCoins = getWithdrawnCoins(messages)
    const vaultUnlockAmount = getVaultUnlockAmount(messages)

    if (!vaultTokenAmount && vaultUnlockAmount) {
      setVaultTokenAmount(vaultUnlockAmount)
    }

    if (depositedCoins.length) {
      setDepositMessage({
        label: t('common.deposited'),
        values: getTokenValueFromCoins(whitelistedAssets, depositedCoins),
      })
    }

    if (borrowedCoins.length) {
      setBorrowMessage({
        label: t('common.borrowed'),
        values: getTokenValueFromCoins(whitelistedAssets, borrowedCoins),
      })
    }

    if (swapCoinIn && swapCoinOut) {
      setSwapMessage({
        label: t('fields.actions.swap'),
        values: [
          `${getTokenValueFromCoins(whitelistedAssets, [swapCoinIn])[0]} → ${
            getTokenValueFromCoins(whitelistedAssets, [swapCoinOut])[0]
          }`,
        ],
      })
    }

    if (repayCoin) {
      setRepayMessage({
        label: t('fields.actions.repaid'),
        values: getTokenValueFromCoins(whitelistedAssets, [repayCoin]),
      })
    }

    if (withdrawnCoins.length) {
      setWithdrawMessage({
        label: t('fields.actions.withdrawn'),
        values: getTokenValueFromCoins(whitelistedAssets, withdrawnCoins),
      })
    }
  }, [
    t,
    data,
    getDepositedCoins,
    getBorrowedCoins,
    getSwapCoinIn,
    getSwapCoinOut,
    getRepayCoin,
    getWithdrawnCoins,
    vaultTokenAmount,
    getVaultUnlockAmount,
    whitelistedAssets,
  ])

  return {
    depositMessage,
    borrowMessage,
    swapMessage,
    repayMessage,
    unlockMessages: unlockMessages || undefined,
    withdrawMessage,
  }
}
