export const loadData = async (key) => {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

export const saveData = async (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}
