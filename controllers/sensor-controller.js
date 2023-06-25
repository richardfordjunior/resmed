const uuid = require('uuid');
const { save, cache } = require('../persistenceHandler/mockDB');
const updateAndValidateRequest = require('../validate').updateAndValidateRequest
const { getAverages , getMinMax } = require('../helpers/utils')

exports.create = async (req) => {
  let sensorData = {}
  let clonedRequest = { ...req.body }
  if (!req.body.pollutants || !Object.keys(req.body).length) {
    throw new Error('Pollutant data not found')
  }
  try {
    req.body = updateAndValidateRequest(req.body)
  } catch (error) {
    // if error return cloned request
    req.body = clonedRequest
    console.log(error)
  }
  let uid = uuid.v4()
  sensorData.id = uid
  sensorData.timestamp = new Date().toISOString()
  // set pollution type timestamps
  Object.keys(req.body.pollutants).map(key => {
    req.body.pollutants[key].timestamp = new Date().toISOString()
  })
  sensorData.pollutants = req.body.pollutants,
    // persist user in memory
    save(sensorData)
  return sensorData;
}

exports.getSensorData = async (req) => {
  const id = req.params.id
  if (id) {
    return getSensorDataStats(cache.filter(item => item.id === id))
  } else {
    return getSensorDataStats(cache)
  }
}



function getSensorDataStats(arr) {
  if (!arr.length) return
  let max, min;
  let pollutants = arr.map(val => val.pollutants)
  min = Math.min(...pollutants[0].map(item => item.value));
  max = Math.max(...pollutants[0].map(item => item.value));

  return {
    min: getMinMax(pollutants[0], min),
    max: getMinMax(pollutants[0], max),
    averages: getAverages(pollutants[0])
  }
}

