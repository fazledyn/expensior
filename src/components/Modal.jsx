import React, { useEffect } from 'react'
import { COLORS } from '../theme'

export default function Modal({ visible, children }) {
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [visible])

  if (!visible) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.sheet}>
        {children}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.CARD,
    width: '100%',
    maxWidth: 430,
    margin: '0 auto',
    maxHeight: '92dvh',
    overflowY: 'auto',
    borderRadius: '16px 16px 0 0',
    padding: 20,
    paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
  },
}
