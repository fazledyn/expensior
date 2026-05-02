import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import MonthSelector from '../components/MonthSelector'
import ProgressBar from '../components/ProgressBar'
import Modal from '../components/Modal'
import { generateId } from '../utils'
import { COLORS } from '../theme'

export default function BudgetScreen() {
  const { categories, monthTransactions, addCategory, updateCategory, deleteCategory } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [form, setForm] = useState({ name: '', limit: '' })

  const spentForCategory = (id) =>
    monthTransactions.filter(t => t.categoryId === id).reduce((sum, t) => sum + t.amount, 0)

  const openAdd = () => {
    setEditingCat(null)
    setForm({ name: '', limit: '' })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditingCat(cat)
    setForm({ name: cat.name, limit: String(cat.limit) })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.limit) {
      alert('Name and limit are required.')
      return
    }
    const data = { name: form.name.trim(), limit: parseFloat(form.limit) }
    if (editingCat) {
      await updateCategory({ ...editingCat, ...data })
    } else {
      await addCategory({ id: generateId(), ...data })
    }
    setShowModal(false)
  }

  const confirmDelete = (cat) => {
    if (window.confirm(`Delete "${cat.name}"? This cannot be undone.`)) {
      deleteCategory(cat.id)
    }
  }

  return (
    <div style={styles.container}>
      <MonthSelector />
      <div style={styles.scroll}>
        {categories.length === 0 && (
          <p style={styles.emptyText}>No categories yet.</p>
        )}
        {categories.map(item => {
          const spent = spentForCategory(item.id)
          const remaining = item.limit - spent
          const progress = item.limit > 0 ? spent / item.limit : 0
          const isOver = spent > item.limit

          return (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardRow}>
                <span style={styles.catName}>{item.name}</span>
                <div style={styles.actions}>
                  <button style={styles.editBtn} onClick={() => openEdit(item)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => confirmDelete(item)}>Delete</button>
                </div>
              </div>
              <div style={styles.statsRow}>
                <span style={styles.stat}>Limit <strong style={styles.statVal}>${parseFloat(item.limit).toFixed(2)}</strong></span>
                <span style={styles.stat}>Spent <strong style={{ ...styles.statVal, ...(isOver ? styles.overText : {}) }}>${spent.toFixed(2)}</strong></span>
                <span style={styles.stat}>Left <strong style={{ ...styles.statVal, ...(remaining < 0 ? styles.overText : {}) }}>${remaining.toFixed(2)}</strong></span>
              </div>
              <ProgressBar progress={progress} isOverLimit={isOver} />
            </div>
          )
        })}

        <button style={styles.addBtn} onClick={openAdd}>+ Add Category</button>
      </div>

      <Modal visible={showModal}>
        <p style={styles.modalTitle}>{editingCat ? 'Edit Category' : 'New Category'}</p>

        <p style={styles.label}>Name *</p>
        <input
          style={styles.input}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Groceries"
        />

        <p style={styles.label}>Monthly Limit *</p>
        <input
          style={styles.input}
          value={form.limit}
          onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
          inputMode="decimal"
          placeholder="500.00"
        />

        <button style={styles.submitBtn} onClick={handleSubmit}>
          {editingCat ? 'Save Changes' : 'Add Category'}
        </button>
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
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.CARD,
    margin: 16,
    marginBottom: 0,
    borderRadius: 10,
    padding: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  catName: { fontSize: 16, fontWeight: '600', color: COLORS.TEXT },
  actions: { display: 'flex', gap: 12 },
  editBtn: { background: 'none', border: 'none', color: COLORS.PRIMARY, fontSize: 14 },
  deleteBtn: { background: 'none', border: 'none', color: COLORS.DANGER, fontSize: 14 },
  statsRow: { display: 'flex', justifyContent: 'space-between', marginTop: 10 },
  stat: { fontSize: 13, color: COLORS.MUTED },
  statVal: { color: COLORS.TEXT, fontWeight: '500' },
  overText: { color: COLORS.DANGER },
  addBtn: {
    display: 'block',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    border: `2px dashed ${COLORS.PRIMARY}`,
    backgroundColor: 'transparent',
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '500',
    width: 'calc(100% - 32px)',
    marginTop: 16,
  },
  emptyText: { textAlign: 'center', marginTop: 40, color: COLORS.MUTED },
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
  submitBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    padding: 16,
    width: '100%',
    border: 'none',
    color: '#fff',
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
