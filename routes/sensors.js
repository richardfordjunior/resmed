const sensorController = require('../controllers/sensor-controller');

async function create(req, res ){
  try {
    const sensorData = await sensorController.create(req);
    res.status(201).json(sensorData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function list(req, res ){
  try {
    const sensorData = await sensorController.getSensorData(req);
    res.status(200).json(sensorData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { create, list }