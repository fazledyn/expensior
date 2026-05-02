import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'
import { generateId } from '../utils'
import { COLORS } from '../theme'

export default function SettingsScreen() {
  const {
    categories, addCategory, updateCategory, deleteCategory,
    sources, addSource, updateSource, deleteSource,
  } = useApp()

  const [catModal, setCatModal] = useState(false)
  const [srcModal, setSrcModal] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [editingSrc, setEditingSrc] = useState(null)
  const [catForm, setCatForm] = useState({ name: '', limit: '' })
  const [srcForm, setSrcForm] = useState({ name: '' })

  const openAddCat = () => { setEditingCat(null); setCatForm({ name: '', limit: '' }); setCatModal(true) }
  const openEditCat = (cat) => { setEditingCat(cat); setCatForm({ name: cat.name, limit: String(cat.limit) }); setCatModal(true) }
  const openAddSrc = () => { setEditingSrc(null); setSrcForm({ name: '' }); setSrcModal(true) }
  const openEditSrc = (src) => { setEditingSrc(src); setSrcForm({ name: src.name }); setSrcModal(true) }

  const submitCat = async () => {
    if (!catForm.name.trim() || !catForm.limit) {
      alert('Name and limit are required.')
      return
    }
    const data = { name: catForm.name.trim(), limit: parseFloat(catForm.limit) }
    if (editingCat) {
      await updateCategory({ ...editingCat, ...data })
    } else {
      await addCategory({ id: generateId(), ...data })
    }
    setCatModal(false)
  }

  const submitSrc = async () => {
    if (!srcForm.name.trim()) {
      alert('Name is required.')
      return
    }
    const data = { name: srcForm.name.trim() }
    if (editingSrc) {
      await updateSource({ ...editingSrc, ...data })
    } else {
      await addSource({ id: generateId(), ...data })
    }
    setSrcModal(false)
  }

  const confirmDeleteCat = (cat) => {
    if (window.confirm(`Delete "${cat.name}"?`)) deleteCategory(cat.id)
  }

  const confirmDeleteSrc = (src) => {
    if (window.confirm(`Delete "${src.name}"?`)) deleteSource(src.id)
  }

  return (
    <div style={styles.container}>
      <p style={styles.sectionTitle}>Categories</p>
      {categories.map(cat => (
        <div key={cat.id} style={styles.row}>
          <div style={styles.rowLeft}>
            <span style={styles.rowName}>{cat.name}</span>
            <span style={styles.rowSub}>${parseFloat(cat.limit).toFixed(2)} / month</span>
          </div>
          <div style={styles.rowActions}>
            <button style={styles.editBtn} onClick={() => openEditCat(cat)}>Edit</button>
            <button style={styles.deleteBtn} onClick={() => confirmDeleteCat(cat)}>Delete</button>
          </div>
        </div>
      ))}
      <button style={styles.addBtn} onClick={openAddCat}>+ Add Category</button>

      <p style={{ ...styles.sectionTitle, marginTop: 40 }}>Payment Sources</p>
      {sources.map(src => (
        <div key={src.id} style={styles.row}>
          <span style={styles.rowName}>{src.name}</span>
          <div style={styles.rowActions}>
            <button style={styles.editBtn} onClick={() => openEditSrc(src)}>Edit</button>
            <button style={styles.deleteBtn} onClick={() => confirmDeleteSrc(src)}>Delete</button>
          </div>
        </div>
      ))}
      <button style={styles.addBtn} onClick={openAddSrc}>+ Add Source</button>

      <Modal visible={catModal}>
        <p style={styles.modalTitle}>{editingCat ? 'Edit Category' : 'New Category'}</p>
        <p style={styles.label}>Name *</p>
        <input
          style={styles.input}
          value={catForm.name}
          onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Groceries"
        />
        <p style={styles.label}>Monthly Limit *</p>
        <input
          style={styles.input}
          value={catForm.limit}
          onChange={e => setCatForm(f => ({ ...f, limit: e.target.value }))}
          inputMode="decimal"
          placeholder="500.00"
        />
        <button style={styles.submitBtn} onClick={submitCat}>
          {editingCat ? 'Save Changes' : 'Add Category'}
        </button>
        <button style={styles.cancelBtn} onClick={() => setCatModal(false)}>Cancel</button>
      </Modal>

      <Modal visible={srcModal}>
        <p style={styles.modalTitle}>{editingSrc ? 'Edit Source' : 'New Source'}</p>
        <p style={styles.label}>Name *</p>
        <input
          style={styles.input}
          value={srcForm.name}
          onChange={e => setSrcForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Amex Gold Card"
        />
        <button style={styles.submitBtn} onClick={submitSrc}>
          {editingSrc ? 'Save Changes' : 'Add Source'}
        </button>
        <button style={styles.cancelBtn} onClick={() => setSrcModal(false)}>Cancel</button>
      </Modal>
    </div>
  )
}

const styles = {
  container: {
    height: '100%',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: 40,
  },
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
  rowLeft: { display: 'flex', flexDirection: 'column' },
  rowName: { fontSize: 15, fontWeight: '500', color: COLORS.TEXT },
  rowSub: { fontSize: 13, color: COLORS.MUTED, marginTop: 2 },
  rowActions: { display: 'flex', gap: 16 },
  editBtn: { background: 'none', border: 'none', color: COLORS.PRIMARY, fontSize: 14 },
  deleteBtn: { background: 'none', border: 'none', color: COLORS.DANGER, fontSize: 14 },
  addBtn: {
    display: 'block',
    marginLeft: 16,
    marginRight: 16,
    padding: 12,
    borderRadius: 8,
    border: `1.5px dashed ${COLORS.PRIMARY}`,
    backgroundColor: 'transparent',
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '500',
    width: 'calc(100% - 32px)',
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
