import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import MonthSelector from '../components/MonthSelector'
import ProgressBar from '../components/ProgressBar'
import Modal from '../components/Modal'
import { generateId } from '../utils'
import { COLORS } from '../theme'

export default function HomeScreen() {
  const { categories, monthTransactions, monthIncome, addIncome, deleteIncome, selectedMonth } = useApp()
  const [incomeModal, setIncomeModal] = useState(false)
  const [incomeForm, setIncomeForm] = useState({ amount: '', note: '' })

  const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = monthIncome.reduce((sum, e) => sum + e.amount, 0)

  const spentForCategory = (categoryId) =>
    monthTransactions.filter(t => t.categoryId === categoryId).reduce((sum, t) => sum + t.amount, 0)

  const openAddIncome = () => {
    setIncomeForm({ amount: '', note: '' })
    setIncomeModal(true)
  }

  const submitIncome = async () => {
    if (!incomeForm.amount) {
      alert('Amount is required.')
      return
    }
    await addIncome({
      id: generateId(),
      month: selectedMonth,
      amount: parseFloat(incomeForm.amount),
      note: incomeForm.note.trim(),
    })
    setIncomeModal(false)
  }

  const confirmDeleteIncome = (entry) => {
    if (window.confirm(`Remove $${entry.amount.toFixed(2)}${entry.note ? ` (${entry.note})` : ''}?`)) {
      deleteIncome(entry.id)
    }
  }

  return (
    <div style={styles.container}>
      <MonthSelector />
      <div style={styles.scroll}>
        <div style={styles.totalCard}>
          <span style={styles.totalLabel}>Total Spent</span>
          <span style={styles.totalAmount}>${totalSpent.toFixed(2)}</span>
        </div>

        <div style={styles.incomeCard}>
          <div style={styles.incomeHeader}>
            <span style={styles.incomeTitle}>Income</span>
            <span style={styles.incomeTotalAmount}>${totalIncome.toFixed(2)}</span>
          </div>
          {monthIncome.length > 0 && <div style={styles.incomeDivider} />}
          {monthIncome.map(entry => (
            <div key={entry.id} style={styles.incomeEntry}>
              <span style={styles.incomeEntryNote}>{entry.note || 'Paycheck'}</span>
              <div style={styles.incomeEntryRight}>
                <span style={styles.incomeEntryAmount}>${entry.amount.toFixed(2)}</span>
                <button style={styles.incomeDeleteBtn} onClick={() => confirmDeleteIncome(entry)}>✕</button>
              </div>
            </div>
          ))}
          <button style={styles.addIncomeBtn} onClick={openAddIncome}>+ Add Paycheck</button>
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

      <Modal visible={incomeModal}>
        <p style={styles.modalTitle}>Add Paycheck</p>
        <p style={styles.label}>Amount *</p>
        <input
          style={styles.input}
          value={incomeForm.amount}
          onChange={e => setIncomeForm(f => ({ ...f, amount: e.target.value }))}
          inputMode="decimal"
          placeholder="2500.00"
          autoFocus
        />
        <p style={styles.label}>Note</p>
        <input
          style={styles.input}
          value={incomeForm.note}
          onChange={e => setIncomeForm(f => ({ ...f, note: e.target.value }))}
          placeholder="e.g. Paycheck 1"
        />
        <button style={styles.submitBtn} onClick={submitIncome}>Add</button>
        <button style={styles.cancelBtn} onClick={() => setIncomeModal(false)}>Cancel</button>
      </Modal>
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
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  totalLabel: { color: 'rgba(0,0,0,0.6)', fontSize: 14 },
  totalAmount: { color: '#000', fontSize: 36, fontWeight: '700', marginTop: 4 },
  incomeCard: {
    backgroundColor: COLORS.CARD,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 10,
    borderRadius: 10,
    padding: 14,
  },
  incomeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incomeTitle: { fontSize: 15, fontWeight: '600', color: COLORS.TEXT },
  incomeTotalAmount: { fontSize: 15, fontWeight: '700', color: COLORS.PRIMARY },
  incomeDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginTop: 10,
    marginBottom: 6,
  },
  incomeEntry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
  },
  incomeEntryNote: { fontSize: 14, color: COLORS.MUTED },
  incomeEntryRight: { display: 'flex', alignItems: 'center', gap: 12 },
  incomeEntryAmount: { fontSize: 14, fontWeight: '500', color: COLORS.TEXT },
  incomeDeleteBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.MUTED,
    fontSize: 13,
    padding: 0,
    cursor: 'pointer',
  },
  addIncomeBtn: {
    marginTop: 10,
    width: '100%',
    padding: '8px 0',
    borderRadius: 8,
    border: `1.5px dashed ${COLORS.PRIMARY}`,
    backgroundColor: 'transparent',
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: COLORS.CARD,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 10,
    borderRadius: 10,
    padding: 14,
  },
  cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  catName: { fontSize: 15, fontWeight: '500', color: COLORS.TEXT },
  catAmount: { fontSize: 14, color: COLORS.MUTED },
  overText: { color: COLORS.DANGER },
  emptyText: { textAlign: 'center', marginTop: 40, color: COLORS.MUTED, fontSize: 14 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: COLORS.TEXT, marginBottom: 20, marginTop: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.MUTED,
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.CARD,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    border: `1px solid ${COLORS.BORDER}`,
    color: COLORS.TEXT,
    width: '100%',
    display: 'block',
    boxSizing: 'border-box',
  },
  submitBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    padding: 16,
    width: '100%',
    border: 'none',
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 32,
    display: 'block',
  },
  cancelBtn: {
    width: '100%',
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    border: 'none',
    background: 'none',
    color: COLORS.MUTED,
    fontSize: 16,
    display: 'block',
  },
}
