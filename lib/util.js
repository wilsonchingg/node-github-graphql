const re = /[‘“!#$%&+^<=>`{}]/

const isStringJSON = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const isValidPath = (str) => {
  return !((typeof str !== 'string') || re.test(str))
}

module.exports = {
  isStringJSON,
  isValidPath
}
