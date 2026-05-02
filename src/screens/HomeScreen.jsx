import React from 'react'
import { useApp } from '../context/AppContext'
import MonthSelector from '../components/MonthSelector'
import ProgressBar from '../components/ProgressBar'
import { COLORS } from '../theme'

export default function HomeScreen() {
  const { categories, monthTransactions } = useApp()

  const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

  const spentForCategory = (categoryId) =>
    monthTransactions.filter(t => t.categoryId === categoryId).reduce((sum, t) => sum + t.amount, 0)

  return (
    <div style={styles.container}>
      <MonthSelector />
      <div style={styles.scroll}>
        <div style={styles.totalCard}>
          <span style={styles.totalLabel}>Total Spent</span>
          <span style={styles.totalAmount}>${totalSpent.toFixed(2)}</span>
        </div>

        {categories.length === 0 ? (
          <p style={styles.emptyText}>No categories yet. Add some in Budget or Settings.</p>
        ) : (
          categories.map(cat => {
            const spent = spentForCategory(cat.id)
            const progress = cat.limit > 0 ? spent / cat.limit : 0
            const isOver = spent > cat.limit

            return (
              <div key={cat.id} style={styles.card}>
                <div style={styles.cardRow}>
                  <span style={styles.catName}>{cat.name}</span>
                  <span style={{ ...styles.catAmount, ...(isOver ? styles.overText : {}) }}>
                    ${spent.toFixed(2)} / ${parseFloat(cat.limit).toFixed(2)}
                  </span>
                </div>
                <ProgressBar progress={progress} isOverLimit={isOver} />
              </div>
            )
          })
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
    paddingBottom: 20,
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
  card: {
    backgroundColor: COLORS.CARD,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 10,
    borderRadius: 10,
    padding: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  catName: { fontSize: 15, fontWeight: '500', color: COLORS.TEXT },
  catAmount: { fontSize: 14, color: COLORS.MUTED },
  overText: { color: COLORS.DANGER },
  emptyText: { textAlign: 'center', marginTop: 40, color: COLORS.MUTED, fontSize: 14 },
}
