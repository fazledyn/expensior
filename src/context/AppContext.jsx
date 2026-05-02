import React, { createContext, useContext, useState, useEffect } from 'react'
import { loadData, saveData } from '../storage'
import { STORAGE_KEYS, DEFAULT_SOURCES } from '../constants'
import { currentMonth } from '../utils'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth())
  const [categories, setCategories] = useState([])
  const [sources, setSources] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    initData()
  }, [])

  const initData = async () => {
    const savedCategories = await loadData(STORAGE_KEYS.CATEGORIES)
    const savedSources = await loadData(STORAGE_KEYS.SOURCES)
    const savedTransactions = await loadData(STORAGE_KEYS.TRANSACTIONS)

    if (savedCategories) setCategories(savedCategories)
    if (savedTransactions) setTransactions(savedTransactions)

    if (savedSources) {
      setSources(savedSources)
    } else {
      setSources(DEFAULT_SOURCES)
      await saveData(STORAGE_KEYS.SOURCES, DEFAULT_SOURCES)
    }
  }

  const persistCategories = async (list) => {
    setCategories(list)
    await saveData(STORAGE_KEYS.CATEGORIES, list)
  }

  const persistSources = async (list) => {
    setSources(list)
    await saveData(STORAGE_KEYS.SOURCES, list)
  }

  const persistTransactions = async (list) => {
    setTransactions(list)
    await saveData(STORAGE_KEYS.TRANSACTIONS, list)
  }

  const addCategory = (cat) => persistCategories([...categories, cat])
  const updateCategory = (updated) => persistCategories(categories.map(c => c.id === updated.id ? updated : c))
  const deleteCategory = (id) => persistCategories(categories.filter(c => c.id !== id))

  const addSource = (src) => persistSources([...sources, src])
  const updateSource = (updated) => persistSources(sources.map(s => s.id === updated.id ? updated : s))
  const deleteSource = (id) => persistSources(sources.filter(s => s.id !== id))

  const addTransaction = (txn) => persistTransactions([...transactions, txn])
  const deleteTransaction = (id) => persistTransactions(transactions.filter(t => t.id !== id))

  const monthTransactions = transactions.filter(t => t.month === selectedMonth)

  return (
    <AppContext.Provider value={{
      selectedMonth, setSelectedMonth,
      categories, sources, transactions, monthTransactions,
      addCategory, updateCategory, deleteCategory,
      addSource, updateSource, deleteSource,
      addTransaction, deleteTransaction,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
