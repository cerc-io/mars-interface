import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate'
import { Coin } from '@cosmjs/proto-signing'
import { MsgExecuteContract } from '@marsprotocol/wallet-connector'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { GAS_ADJUSTMENT } from 'constants/appConstants'
import { getPythVaaMessage } from 'libs/pyth'
import useStore from 'store'
import { QUERY_KEYS } from 'types/enums/queryKeys'
import { ContractMsg } from 'types/types'

interface Props {
  msg?: ContractMsg
  funds?: Coin[]
  contract?: string
  sender?: string
  executeMsg?: MsgExecuteContractEncodeObject
}

export const useEstimateFee = (props: Props) => {
  const userWalletAddress = useStore((s) => s.userWalletAddress)
  const client = useStore((s) => s.client)
  const pythVaa = useStore((s) => s.pythVaa)
  const networkConfig = useStore((s) => s.networkConfig)
  const baseCurrencyDenom = networkConfig.assets.base.denom
  const pythContractAddress = networkConfig.contracts?.pyth
  const isLedger = useStore((s) => s.isLedger)
  const pythVaaMessage = getPythVaaMessage(
    pythVaa,
    baseCurrencyDenom,
    isLedger,
    pythContractAddress,
    userWalletAddress,
  )

  return useQuery(
    [QUERY_KEYS.ESTIMATE_FEE, props.msg],
    async () => {
      const sender = props.sender ? props.sender : userWalletAddress
      const gasAdjustment = GAS_ADJUSTMENT

      if (!client || !props.contract || !props.msg) return

      const messages = [
        new MsgExecuteContract({
          sender: sender,
          contract: props.contract,
          msg: props.msg,
          funds: props.funds,
        }),
      ]
      if (pythVaaMessage) messages.unshift(pythVaaMessage)

      try {
        const simulateOptions = {
          messages,
          wallet: client.connectedWallet,
        }

        const result = await client.simulate(simulateOptions)

        if (result.success) {
          return {
            amount: result.fee ? result.fee.amount : [],
            gas: new BigNumber(result.fee ? result.fee.gas : 0)
              .multipliedBy(gasAdjustment)
              .toFixed(0),
          }
        }
        throw result.error
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    {
      enabled: !!client && ((!!props.msg && !!props.contract) || !!props.executeMsg),
    },
  )
}
