import React, { useState } from 'react'
import { AppProvider } from './context/AppContext'
import HomeScreen from './screens/HomeScreen'
import TransactionsScreen from './screens/TransactionsScreen'
import BudgetScreen from './screens/BudgetScreen'
import SummaryScreen from './screens/SummaryScreen'
import SettingsScreen from './screens/SettingsScreen'
import { COLORS } from './theme'

const TABS = [
  { key: 'home', label: 'Home', icon: '🏠', component: HomeScreen },
  { key: 'transactions', label: 'Transactions', icon: '💳', component: TransactionsScreen },
  { key: 'budget', label: 'Budget', icon: '📊', component: BudgetScreen },
  { key: 'summary', label: 'Summary', icon: '📋', component: SummaryScreen },
  { key: 'settings', label: 'Settings', icon: '⚙️', component: SettingsScreen },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const ActiveScreen = TABS.find(t => t.key === activeTab).component

  return (
    <AppProvider>
      <div style={styles.app}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>{TABS.find(t => t.key === activeTab).label}</span>
        </div>
        <div style={styles.content}>
          <ActiveScreen />
        </div>
        <div style={styles.tabBar}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              style={{
                ...styles.tabItem,
                color: activeTab === tab.key ? COLORS.PRIMARY : COLORS.MUTED,
                borderTop: activeTab === tab.key ? `2px solid ${COLORS.PRIMARY}` : '2px solid transparent',
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              <span style={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </AppProvider>
  )
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    maxWidth: 430,
    margin: '0 auto',
    backgroundColor: COLORS.BG,
    position: 'relative',
    boxShadow: '0 0 40px rgba(0,0,0,0.1)',
  },
  header: {
    backgroundColor: COLORS.CARD,
    borderBottom: `1px solid ${COLORS.BORDER}`,
    padding: '12px 16px',
    paddingTop: 'max(12px, env(safe-area-inset-top))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: COLORS.CARD,
    borderTop: `1px solid ${COLORS.BORDER}`,
    paddingBottom: 'env(safe-area-inset-bottom)',
    flexShrink: 0,
  },
  tabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 4px',
    border: 'none',
    background: 'none',
    gap: 2,
    transition: 'color 0.15s',
  },
  tabIcon: {
    fontSize: 20,
    lineHeight: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
}
