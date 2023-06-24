const getMinMax = (arr, type) => {
  try {
    return arr.find(obj => obj.value === type)
  } catch (error) {
    console.log(error)
    return {}
  }
}

const getAverages = (data) => {
  try {
    let groupings = {}
    data.forEach(group => groupings.hasOwnProperty(group.name) ? groupings[group.name].push(+group.value) : groupings[group.name] = [+group.value]),
      avgs = Object.assign(...Object.entries(groupings)
        .map(pollutant => ({
          [pollutant[0]]:
            (pollutant[1].reduce((b, a) => b + a) / groupings[pollutant[0]].length).toFixed(2)
        })))
    return avgs
  } catch (error) {
    console.log(error)
    return {}
  }
}

module.exports = { getAverages, getMinMax }