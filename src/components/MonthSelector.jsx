import React from 'react'
import { useApp } from '../context/AppContext'
import { formatMonth, shiftMonth } from '../utils'
import { COLORS } from '../theme'

export default function MonthSelector() {
  const { selectedMonth, setSelectedMonth } = useApp()

  return (
    <div style={styles.container}>
      <button style={styles.arrow} onClick={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}>
        ‹
      </button>
      <span style={styles.month}>{formatMonth(selectedMonth)}</span>
      <button style={styles.arrow} onClick={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}>
        ›
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: COLORS.CARD,
    borderBottom: `1px solid ${COLORS.BORDER}`,
    flexShrink: 0,
  },
  arrow: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 28,
    color: COLORS.PRIMARY,
    background: 'none',
    border: 'none',
    lineHeight: 1,
  },
  month: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    minWidth: 160,
    textAlign: 'center',
  },
}
