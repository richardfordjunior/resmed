const server = require('../bin/www').server
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.should()
chai.use(chaiHttp)
const timekeeper = require('timekeeper');
const time = '2023-06-23T19:15:11.875Z'

describe('API', function () {
  describe('# Sensor Data', function () {
    beforeEach(() => {
      timekeeper.freeze(time)
    })
    afterEach(() => {
      timekeeper.reset()
      server.close()
    })

    it('posts sensor data', async function () {
      const postData = {
        "timestamp": new Date().toISOString(),
        "pollutants": [
          { "name": "groundLevelOzone", "value": 0.5, "timestamp": new Date().toISOString() },
          { "name": "carbonMonoxide", "value": 50, "timestamp": new Date().toISOString() },
          { "name": "sulfurDioxide", "value": 1000, "timestamp": new Date().toISOString() },
          { "name": "nitrogenDioxide", "value": 2049, "timestamp": new Date().toISOString() },
          { "name": "groundLevelOzone", "value": 0.6, "timestamp": new Date().toISOString() },
          { "name": "carbonMonoxide", "value": 45, "timestamp": new Date().toISOString() },
          { "name": "sulfurDioxide", "value": 950, "timestamp": new Date().toISOString() },
          { "name": "nitrogenDioxide", "value": 1234, "timestamp": new Date().toISOString() }
        ]
      }
      const res = await chai.request(server)
        .post('/sensors')
        .set('content-type', 'application/json')
        .send(postData)
      res.statusCode.should.equal(201)
      res.body.should.be.a('object')
      res.body.should.have.property('id')
      res.body.should.have.property('timestamp')
      res.body.should.have.property('pollutants')
      const response = await chai.request(server)
      .get('/sensors')
    })

    it('returns an error when pollutant data is missing', async function () {
      const res = await chai.request(server)
        .post('/sensors')
        .set('content-type', 'application/json')
        .send({})
      res.statusCode.should.equal(500)
      res.body.error.should.deep.equal('Pollutant data not found')
    })

    it('handles invalid pollutant data', async function () {
      const postData = {
        "timestamp": new Date().toISOString(),
        "pollutants": [
          { "name": "groundLevelOzone", "value": 0.605, "timestamp": new Date().toISOString() },
          { "name": "carbonMonoxide", "value": 50, "timestamp": new Date().toISOString() },
          { "name": "sulfurDioxide", "value": 1000, "timestamp": new Date().toISOString() },
          { "name": "nitrogenDioxide", "value": 2050, "timestamp": new Date().toISOString() }
        ]
      }
      const res = await chai.request(server)
        .post('/sensors')
        .set('content-type', 'application/json')
        .send(postData)
      res.statusCode.should.equal(201)
      res.body.pollutants[0].value.should.deep.equal({ "error": "invalid measurement", "originalValue": 0.605 })
      res.body.pollutants[3].value.should.deep.equal({ "error": "invalid measurement", "originalValue": 2050 })
    })


    it('gets sensor data by sensor id', function (done) {
      const postData = {
        "timestamp": new Date().toISOString(),
        "pollutants": [
          { "name": "groundLevelOzone", "value": 0.5, "timestamp": new Date().toISOString() },
          { "name": "carbonMonoxide", "value": 50, "timestamp": new Date().toISOString() },
          { "name": "sulfurDioxide", "value": 1000, "timestamp": new Date().toISOString() },
          { "name": "nitrogenDioxide", "value": 2049, "timestamp": new Date().toISOString() }
        ]
      }
      chai.request(server)
        .post('/sensors')
        .set('content-type', 'application/json')
        .send(postData)
        .then(response => {
          chai.request(server)
            .get(`/sensors/${response.body.id}`)
            .end((err, res) => {
              if (err) { return done(err) }
              res.statusCode.should.equal(200)
              res.body.should.have.property('min')
              res.body.should.have.property('max')
              res.body.should.have.property('averages')
            })
        })
      done()
    })

    it('gets all sensor data', function (done) {
      const postData = {
        "timestamp": new Date().toISOString(),
        "pollutants": [
          { "name": "groundLevelOzone", "value": 0.5, "timestamp": new Date().toISOString() },
          { "name": "carbonMonoxide", "value": 50, "timestamp": new Date().toISOString() },
          { "name": "sulfurDioxide", "value": 1000, "timestamp": new Date().toISOString() },
          { "name": "nitrogenDioxide", "value": 2049, "timestamp": new Date().toISOString() }
        ]
      }
      chai.request(server)
        .post('/sensors')
        .set('content-type', 'application/json')
        .send(postData)
        .then(response => {
          chai.request(server)
            .get(`/sensors`)
            .end((err, res) => {
              res.statusCode.should.equal(200)
              res.body.should.have.property('min')
              res.body.should.have.property('max')
              res.body.should.have.property('averages')
              done()
            })

        })
    })

    describe('# Stats', function () {
      beforeEach(() => {
        timekeeper.freeze(time)
      })
      afterEach(() => {
        timekeeper.reset()
      })

      it('gets average sensor data', async function () {
        const postData = {
          "timestamp": new Date().toISOString(),
          "pollutants": [
            { "name": "groundLevelOzone", "value": 0.5, "timestamp": new Date().toISOString() },
            { "name": "carbonMonoxide", "value": 50, "timestamp": new Date().toISOString() },
            { "name": "sulfurDioxide", "value": 1000, "timestamp": new Date().toISOString() },
            { "name": "nitrogenDioxide", "value": 2049, "timestamp": new Date().toISOString() },
            { "name": "groundLevelOzone", "value": 0.6, "timestamp": new Date().toISOString() },
            { "name": "carbonMonoxide", "value": 45, "timestamp": new Date().toISOString() },
            { "name": "sulfurDioxide", "value": 950, "timestamp": new Date().toISOString() },
            { "name": "nitrogenDioxide", "value": 1234, "timestamp": new Date().toISOString() }
          ]
        }

        let data = await chai.request(server)
          .post('/sensors')
          .set('content-type', 'application/json')
          .send(postData)

        let res = await chai.request(server)
          .get(`/sensors`)
        res.statusCode.should.equal(200)
        res.body.averages.should.deep.equal({
          groundLevelOzone: '0.55',
          carbonMonoxide: '47.50',
          sulfurDioxide: '975.00',
          nitrogenDioxide: '1641.50'
        })
      })
    })
  })
})