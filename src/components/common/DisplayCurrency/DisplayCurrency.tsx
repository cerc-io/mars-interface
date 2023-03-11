import { Coin } from '@cosmjs/stargate'
import { AnimatedNumber } from 'components/common'
import useStore from 'store'

interface Props {
  coin: Coin
  prefixClass?: string
  valueClass?: string
  isApproximation?: boolean
  className?: string
}

export const DisplayCurrency = ({
  coin,
  prefixClass,
  valueClass,
  isApproximation,
  className,
}: Props) => {
  const networkConfig = useStore((s) => s.networkConfig)
  const convertToDisplayCurrency = useStore((s) => s.convertToDisplayCurrency)
  const amount = convertToDisplayCurrency(coin)
  const displayCurrency = networkConfig?.displayCurrency

  if (!displayCurrency) return null

  return (
    <div className={className}>
      {displayCurrency.prefix && (
        <span className={prefixClass}>
          {displayCurrency.prefix}
          {isApproximation && '~'}
        </span>
      )}
      <span className={valueClass}>
        <AnimatedNumber
          amount={amount}
          minDecimals={displayCurrency.decimals}
          maxDecimals={displayCurrency.decimals}
        />
      </span>
      {displayCurrency.suffix && <span className={valueClass}>{' ' + displayCurrency.suffix}</span>}
    </div>
  )
}
