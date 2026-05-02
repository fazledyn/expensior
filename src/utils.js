export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const shiftMonth = (monthStr, direction) => {
  const [year, month] = monthStr.split('-').map(Number)
  const date = new Date(year, month - 1 + direction)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split('-')
  const date = new Date(year, month - 1)
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}
