import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import MonthSelector from '../components/MonthSelector'
import Modal from '../components/Modal'
import { generateId } from '../utils'
import { COLORS } from '../theme'

const EMPTY_FORM = { note: '', amount: '', categoryId: '', sourceId: '', month: '' }

export default function TransactionsScreen() {
  const { categories, sources, monthTransactions, selectedMonth, addTransaction, deleteTransaction } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const openModal = () => {
    setForm({ ...EMPTY_FORM, month: selectedMonth })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!form.amount || !form.categoryId || !form.sourceId) {
      alert('Amount, category, and source are required.')
      return
    }
    await addTransaction({
      id: generateId(),
      note: form.note.trim(),
      amount: parseFloat(form.amount),
      categoryId: form.categoryId,
      sourceId: form.sourceId,
      month: form.month || selectedMonth,
    })
    setShowModal(false)
  }

  const confirmDelete = (id) => {
    if (window.confirm('Delete transaction? This cannot be undone.')) {
      deleteTransaction(id)
    }
  }

  const categoryName = (id) => categories.find(c => c.id === id)?.name || '?'
  const sourceName = (id) => sources.find(s => s.id === id)?.name || '?'

  return (
    <div style={styles.container}>
      <MonthSelector />
      <div style={styles.list}>
        {monthTransactions.length === 0 ? (
          <p style={styles.emptyText}>No transactions this month.</p>
        ) : (
          monthTransactions.map(item => (
            <div
              key={item.id}
              style={styles.item}
              onContextMenu={e => { e.preventDefault(); confirmDelete(item.id) }}
            >
              <div style={styles.itemLeft}>
                <span style={styles.itemNote}>{item.note || '—'}</span>
                <span style={styles.itemMeta}>{categoryName(item.categoryId)} · {sourceName(item.sourceId)}</span>
              </div>
              <div style={styles.itemRight}>
                <span style={styles.itemAmount}>${item.amount.toFixed(2)}</span>
                <button style={styles.deleteBtn} onClick={() => confirmDelete(item.id)}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>

      <button style={styles.fab} onClick={openModal}>+</button>

      <Modal visible={showModal}>
        <p style={styles.modalTitle}>Add Transaction</p>

        <p style={styles.label}>Note</p>
        <input
          style={styles.input}
          value={form.note}
          onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
          placeholder="e.g. Costco Gas"
        />

        <p style={styles.label}>Amount *</p>
        <input
          style={styles.input}
          value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          inputMode="decimal"
          placeholder="0.00"
        />

        <p style={styles.label}>Category *</p>
        <div style={styles.chipGroup}>
          {categories.map(cat => (
            <button
              key={cat.id}
              style={{ ...styles.chip, ...(form.categoryId === cat.id ? styles.chipSelected : {}) }}
              onClick={() => setForm(f => ({ ...f, categoryId: cat.id }))}
            >
              <span style={{ ...styles.chipText, ...(form.categoryId === cat.id ? styles.chipTextSelected : {}) }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        <p style={styles.label}>Payment Source *</p>
        <div style={styles.chipGroup}>
          {sources.map(src => (
            <button
              key={src.id}
              style={{ ...styles.chip, ...(form.sourceId === src.id ? styles.chipSelected : {}) }}
              onClick={() => setForm(f => ({ ...f, sourceId: src.id }))}
            >
              <span style={{ ...styles.chipText, ...(form.sourceId === src.id ? styles.chipTextSelected : {}) }}>
                {src.name}
              </span>
            </button>
          ))}
        </div>

        <p style={styles.label}>Month</p>
        <input
          style={styles.input}
          value={form.month}
          onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
          placeholder="YYYY-MM"
        />

        <button style={styles.submitBtn} onClick={handleSubmit}>Add Transaction</button>
        <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
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
    position: 'relative',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: 80,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    borderRadius: 10,
    padding: 14,
  },
  itemLeft: { display: 'flex', flexDirection: 'column', flex: 1 },
  itemNote: { fontSize: 15, fontWeight: '500', color: COLORS.TEXT },
  itemMeta: { fontSize: 13, color: COLORS.MUTED, marginTop: 2 },
  itemRight: { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 12 },
  itemAmount: { fontSize: 16, fontWeight: '600', color: COLORS.TEXT },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.MUTED,
    fontSize: 14,
    padding: '2px 4px',
    lineHeight: 1,
  },
  emptyText: { textAlign: 'center', marginTop: 60, color: COLORS.MUTED },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.PRIMARY,
    color: '#000',
    width: 56,
    height: 56,
    borderRadius: 28,
    border: 'none',
    fontSize: 32,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 16px rgba(255,255,255,0.15)`,
    zIndex: 10,
  },
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
  },
  chipGroup: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 20,
    backgroundColor: COLORS.CARD,
    border: `1px solid ${COLORS.BORDER}`,
  },
  chipSelected: { backgroundColor: COLORS.PRIMARY, borderColor: COLORS.PRIMARY },
  chipText: { fontSize: 14, color: COLORS.TEXT },
  chipTextSelected: { color: '#000', fontWeight: '500' },
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
