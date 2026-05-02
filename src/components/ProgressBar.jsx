import React from 'react'
import { COLORS } from '../theme'

export default function ProgressBar({ progress, isOverLimit }) {
  const fillWidth = `${Math.min(progress, 1) * 100}%`

  return (
    <div style={styles.track}>
      <div style={{
        ...styles.fill,
        width: fillWidth,
        backgroundColor: isOverLimit ? COLORS.DANGER : COLORS.PRIMARY,
      }} />
    </div>
  )
}

const styles = {
  track: {
    height: 8,
    backgroundColor: COLORS.BORDER,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
}
