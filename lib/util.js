const isStringJSON = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

module.exports = {
  isStringJSON
}
