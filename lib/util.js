function allLowerCase (inputString) {
  return inputString.toLowerCase()
}
function capitalize (inputString) {
  if (inputString) {
    return inputString[0].toUpperCase() + inputString.substring(1).toLowerCase()
  }
}
module.exports = {
  allLowerCase,
  capitalize
}
