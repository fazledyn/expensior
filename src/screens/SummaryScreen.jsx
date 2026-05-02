import React from 'react'
import { useApp } from '../context/AppContext'
import MonthSelector from '../components/MonthSelector'
import { COLORS } from '../theme'

export default function SummaryScreen() {
  const { categories, sources, monthTransactions } = useApp()

  const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

  const spentByCategory = categories.map(cat => ({
    ...cat,
    spent: monthTransactions.filter(t => t.categoryId === cat.id).reduce((sum, t) => sum + t.amount, 0),
  }))

  const spentBySource = sources
    .map(src => ({
      ...src,
      spent: monthTransactions.filter(t => t.sourceId === src.id).reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter(src => src.spent > 0)

  return (
    <div style={styles.container}>
      <MonthSelector />
      <div style={styles.scroll}>
        <div style={styles.totalCard}>
          <span style={styles.totalLabel}>Total Spent</span>
          <span style={styles.totalAmount}>${totalSpent.toFixed(2)}</span>
        </div>

        <p style={styles.sectionTitle}>By Category</p>
        {spentByCategory.length === 0 ? (
          <p style={styles.emptyText}>No categories.</p>
        ) : (
          spentByCategory.map(cat => {
            const remaining = cat.limit - cat.spent
            return (
              <div key={cat.id} style={styles.row}>
                <span style={styles.rowLabel}>{cat.name}</span>
                <div style={styles.rowRight}>
                  <span style={styles.rowAmount}>${cat.spent.toFixed(2)}</span>
                  <span style={{ ...styles.rowSub, ...(remaining < 0 ? styles.overText : {}) }}>
                    {remaining >= 0
                      ? `$${remaining.toFixed(2)} remaining`
                      : `$${Math.abs(remaining).toFixed(2)} over limit`}
                  </span>
                </div>
              </div>
            )
          })
        )}

        <p style={styles.sectionTitle}>By Payment Source</p>
        {spentBySource.length === 0 ? (
          <p style={styles.emptyText}>No transactions this month.</p>
        ) : (
          spentBySource.map(src => (
            <div key={src.id} style={styles.row}>
              <span style={styles.rowLabel}>{src.name}</span>
              <span style={styles.rowAmount}>${src.spent.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: 30,
  },
  totalCard: {
    backgroundColor: COLORS.PRIMARY,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  totalLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  totalAmount: { color: '#fff', fontSize: 36, fontWeight: '700', marginTop: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 14,
  },
  rowLabel: { fontSize: 15, color: COLORS.TEXT },
  rowRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  rowAmount: { fontSize: 15, fontWeight: '600', color: COLORS.TEXT },
  rowSub: { fontSize: 12, color: COLORS.MUTED, marginTop: 2 },
  overText: { color: COLORS.DANGER },
  emptyText: { textAlign: 'center', marginTop: 12, color: COLORS.MUTED, fontSize: 14 },
}
