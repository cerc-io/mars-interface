import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import BigNumber from 'bignumber.js'
import { AnimatedNumber, Button, CellAmount, SVG, TextTooltip } from 'components/common'
import Image from 'next/image'
import { useMemo } from 'react'
import { isMobile, isTablet } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

import styles from '../RedbankColumns.module.scss'

export const useBorrowColumns = () => {
  const { t } = useTranslation()
  const columnHelper = createColumnHelper<RedBankAsset>()
  const enableSorting = !isMobile && !isTablet

  const defaultBorrowColumns: ColumnDef<RedBankAsset, any>[] = useMemo(
    () => [
      columnHelper.accessor('color', {
        enableSorting: false,
        header: '',
        cell: (info) => (
          <div
            className={`${styles.color} ${styles[info.row.original.id.toLowerCase()]} ${
              info.row.getIsExpanded() ? styles.expanded : ''
            }`}
          />
        ),
      }),
      columnHelper.accessor('logo', {
        enableSorting: false,
        header: '',
        cell: (info) => (
          <div className={styles.logo}>
            <Image alt='logo' src={info.getValue().src} width={32} height={32} />
          </div>
        ),
      }),
      columnHelper.accessor('symbol', {
        enableSorting: enableSorting,
        header: () => (
          <TextTooltip text={t('common.asset')} tooltip={t('redbank.tooltips.borrow.assets')} />
        ),
        id: 'name',
        cell: (info) => (
          <>
            <p className='m'>{info.getValue()}</p>
            <p className='s faded'>{info.row.original.name}</p>
          </>
        ),
      }),
      columnHelper.accessor('borrowBalance', {
        enableSorting: enableSorting,
        sortingFn: (a, b): number => {
          const balanceA = new BigNumber(a.original.borrowBalance).shiftedBy(-a.original.decimals)
          const balanceB = new BigNumber(b.original.borrowBalance).shiftedBy(-b.original.decimals)
          return balanceA.minus(balanceB).toNumber()
        },
        header: () => (
          <TextTooltip
            text={t('common.borrowed')}
            tooltip={t('redbank.tooltips.borrow.borrowed')}
          />
        ),
        cell: (info) => (
          <CellAmount
            amount={Number(info.row.original.borrowBalance)}
            decimals={info.row.original.decimals}
            denom={info.row.original.denom}
            noBalanceText={t('common.noDebt')}
          />
        ),
      }),
      columnHelper.accessor('borrowRate', {
        enableSorting: enableSorting,

        header: () => (
          <TextTooltip text={t('common.rate')} tooltip={t('redbank.tooltips.borrow.rate')} />
        ),
        cell: (info) => (
          <AnimatedNumber
            amount={info.getValue()}
            suffix='%'
            abbreviated={false}
            rounded={false}
            className='m'
          />
        ),
      }),
      columnHelper.accessor('marketLiquidity', {
        enableSorting: enableSorting,
        header: () => (
          <TextTooltip
            text={t('common.marketLiquidityShort')}
            tooltip={t('redbank.tooltips.borrow.marketLiquidity')}
          />
        ),
        cell: (info) => (
          <CellAmount
            amount={Number(info.row.original.marketLiquidity)}
            decimals={info.row.original.decimals}
            denom={info.row.original.denom}
          />
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
          <Button
            color='quaternary'
            prefix={row.getIsExpanded() ? <SVG.Collapse /> : <SVG.Expand />}
            variant='round'
          />
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return defaultBorrowColumns
}
