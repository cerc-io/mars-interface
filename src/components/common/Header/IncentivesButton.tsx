import { ChainInfoID, SimpleChainInfoList, TxBroadcastResult } from '@marsprotocol/wallet-connector'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import {
  AnimatedNumber,
  Button,
  DisplayCurrency,
  ErrorMessage,
  SVG,
  Tooltip,
  TxLink,
} from 'components/common'
import { MARS_DECIMALS, MARS_SYMBOL } from 'constants/appConstants'
import { getClaimUserRewardsMsgOptions } from 'functions/messages'
import { useEstimateFee } from 'hooks/queries'
import { lookup, lookupDenomBySymbol, lookupSymbol } from 'libs/parse'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useStore from 'store'
import { QUERY_KEYS } from 'types/enums/queryKeys'

import styles from './IncentivesButton.module.scss'

export const IncentivesButton = () => {
  // ---------------
  // EXTERNAL HOOKS
  // ---------------
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  // ---------------
  // STORE STATE
  // ---------------
  const client = useStore((s) => s.client)
  const otherAssets = useStore((s) => s.otherAssets)
  const userWalletAddress = useStore((s) => s.userWalletAddress)
  const unclaimedRewards = useStore((s) => s.userUnclaimedRewards)
  const incentivesContractAddress = useStore((s) => s.networkConfig.contracts.incentives)
  const chainInfo = useStore((s) => s.chainInfo)
  const executeMsg = useStore((s) => s.executeMsg)

  // ---------------
  // LOCAL STATE
  // ---------------
  const [showDetails, setShowDetails] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<TxBroadcastResult>()
  const [error, setError] = useState<string>()
  const [hasUnclaimedRewards, setHasUnclaimedRewards] = useState(false)

  // ---------------
  // LOCAL VARIABLES
  // ---------------
  const marsDenom = lookupDenomBySymbol(MARS_SYMBOL, otherAssets)
  const explorerUrl = chainInfo && SimpleChainInfoList[chainInfo.chainId as ChainInfoID].explorer

  // ---------------
  // FUNCTIONS
  // ---------------
  const onClickAway = useCallback(() => {
    setShowDetails(false)
    setResponse(undefined)
    setError(undefined)
  }, [])

  useEffect(() => {
    setHasUnclaimedRewards(Number(unclaimedRewards) > 0)
  }, [unclaimedRewards])

  const txMsgOptions = useMemo(() => {
    if (!hasUnclaimedRewards) return
    return getClaimUserRewardsMsgOptions()
  }, [hasUnclaimedRewards])

  const { data: fee, error: feeError } = useEstimateFee({
    msg: txMsgOptions?.msg,
    funds: [],
    contract: incentivesContractAddress,
  })

  if (feeError && error !== feeError && !fee) {
    setError(feeError as string)
  }

  useEffect(() => {
    const isFetching = submitted || (!fee && !response && hasUnclaimedRewards)
    if (fetching === isFetching) return
    setFetching(isFetching)
  }, [submitted, fetching, fee, response, hasUnclaimedRewards])

  useEffect(() => {
    if (error) {
      setDisabled(!hasUnclaimedRewards)
      setSubmitted(false)
      return
    }
    if (response?.hash) {
      setDisabled(true)
      setSubmitted(false)
      return
    }

    setDisabled(!hasUnclaimedRewards)
  }, [error, response, hasUnclaimedRewards])

  const claimRewards = async () => {
    if (!incentivesContractAddress || !client) {
      setError(t('error.errorClaim'))
      setDisabled(true)
      setSubmitted(false)
      return
    }
    setDisabled(true)
    setSubmitted(true)
    setError(undefined)

    if (!fee || !txMsgOptions) {
      return
    }

    try {
      const res = await executeMsg({
        msg: txMsgOptions.msg,
        funds: [],
        contract: incentivesContractAddress,
        fee,
      })

      setResponse(res)
      queryClient.invalidateQueries([QUERY_KEYS.REDBANK])
    } catch (error) {
      const e = error as { message: string }
      setError(e.message as string)
    }
  }

  const transactionHash = response?.hash || ''

  if (!userWalletAddress) return null

  return (
    <div className={styles.wrapper}>
      <button
        className={classNames(
          Number(unclaimedRewards) > 1000000
            ? `${styles.button} ${styles.buttonHighlight}`
            : styles.button,
        )}
        onClick={() => {
          setShowDetails(!showDetails)
        }}
      >
        <SVG.Logo />
        <span>
          <AnimatedNumber
            amount={Number(unclaimedRewards) / 1e6}
            minDecimals={2}
            maxDecimals={2}
            className={styles.marsAmount}
          />
          {MARS_SYMBOL}
        </span>
      </button>

      {showDetails && (
        <>
          <div className={styles.details}>
            <div className={styles.detailsHeader}>
              <p className={styles.detailsHead}>{t('incentives.marsRewardsCenter')}</p>
              <div className={styles.tooltip}>
                <Tooltip content={t('incentives.marsRewardsCenterTooltip')} />
              </div>
            </div>

            <div className={styles.detailsBody}>
              {response ? (
                <div className={`${styles.container} ${styles.info}`}>
                  <p className='m'>{t('incentives.successfullyClaimed')}</p>
                  <TxLink hash={transactionHash} link={`${explorerUrl}/txs/${transactionHash}`} />
                </div>
              ) : (
                <div className={styles.container}>
                  <div className={styles.position}>
                    <div className={styles.label}>
                      <p className={styles.token}>{lookupSymbol(marsDenom, otherAssets)}</p>
                      <p className={styles.subhead}>{t('redbank.redBankRewards')}</p>
                    </div>
                    <div className={styles.value}>
                      <AnimatedNumber
                        className={styles.tokenAmount}
                        amount={lookup(Number(unclaimedRewards) || 0, MARS_SYMBOL, MARS_DECIMALS)}
                        maxDecimals={MARS_DECIMALS}
                        minDecimals={2}
                      />
                      <DisplayCurrency
                        className={styles.tokenValue}
                        coin={{
                          amount: unclaimedRewards,
                          denom: marsDenom,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.claimButton}>
                <Button
                  disabled={disabled}
                  showProgressIndicator={fetching}
                  text={
                    Number(unclaimedRewards) > 0 && !disabled
                      ? t('incentives.claimRewards')
                      : t('incentives.nothingToClaim')
                  }
                  onClick={() => (submitted ? null : claimRewards())}
                  color='primary'
                />
                <ErrorMessage message={error} alignment='center' />
              </div>
            </div>
          </div>
          <div className={styles.clickAway} onClick={onClickAway} role='button' />
        </>
      )}
    </div>
  )
}
