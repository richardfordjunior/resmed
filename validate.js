
const pollutantConstraints = {
  groundLevelOzone: {
    min: 0,
    max: 0.604
  },
  carbonMonoxide: {
    min: 0,
    max: 50.4
  },
  sulfurDioxide: {
    min: 0,
    max: 1004
  },
  nitrogenDioxide: {
    min: 0,
    max: 2049
  }
}

exports.updateAndValidateRequest = (requestObject) => {
  if (!requestObject.pollutants.length) { return; }
  // if any pollutant is greater than the threshold, seet with max value, update request
  requestObject.pollutants.map(pollutant => {
    for (const key in pollutantConstraints) {
      if (key === pollutant.name) {
        if ((pollutant.value > pollutantConstraints[key].max) ||
          (pollutant.value < 0)) {
          pollutant.value = { error: 'invalid measurement', originalValue: pollutant.value }
        }
      }
    }
  })
  return requestObject;
}
