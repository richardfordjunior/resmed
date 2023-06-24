const server = require('../bin/www').server
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.should()
chai.use(chaiHttp)

describe('API', function () {
  describe('# Sensor Data', function () {
    it('posts sensor data', async function () {
      const postData = {
        "id": 1004,
        "timestamp": "2023-06-25T19:15:11.875Z",
        "pollutants": [
          { "name": "groundLevelOzone", "value": 0.5, "timestamp": "2023-06-23T20:21:39.960Z" },
          { "name": "carbonMonoxide", "value": 50, "timestamp": "2023-06-23T20:22:39.960Z" },
          { "name": "sulfurDioxide", "value": 1000, "timestamp": "2023-06-23T20:23:39.960Z" },
          { "name": "nitrogenDioxide", "value": 2049, "timestamp": "2023-06-23T20:24:39.960Z" }
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
        "id": 1004,
        "timestamp": "2023-06-25T19:15:11.875Z",
        "pollutants": [
          { "name": "groundLevelOzone", "value": 0.605, "timestamp": "2023-06-23T20:21:39.960Z" },
          { "name": "carbonMonoxide", "value": 50, "timestamp": "2023-06-23T20:22:39.960Z" },
          { "name": "sulfurDioxide", "value": 1000, "timestamp": "2023-06-23T20:23:39.960Z" },
          { "name": "nitrogenDioxide", "value": 2050, "timestamp": "2023-06-23T20:24:39.960Z" }
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
        "timestamp": "2023-06-25T19:15:11.875Z",
        "pollutants": [
          { "name": "groundLevelOzone", "value": 0.5, "timestamp": "2023-06-23T20:21:39.960Z" },
          { "name": "carbonMonoxide", "value": 50, "timestamp": "2023-06-23T20:22:39.960Z" },
          { "name": "sulfurDioxide", "value": 1000, "timestamp": "2023-06-23T20:23:39.960Z" },
          { "name": "nitrogenDioxide", "value": 2049, "timestamp": "2023-06-23T20:24:39.960Z" }
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

    it('gets all sensor data', async function () {
      const postData = {
        "timestamp": "2023-06-25T19:15:11.875Z",
        "pollutants": [
          { "name": "groundLevelOzone", "value": 0.5, "timestamp": "2023-06-23T20:21:39.960Z" },
          { "name": "carbonMonoxide", "value": 50, "timestamp": "2023-06-23T20:22:39.960Z" },
          { "name": "sulfurDioxide", "value": 1000, "timestamp": "2023-06-23T20:23:39.960Z" },
          { "name": "nitrogenDioxide", "value": 2049, "timestamp": "2023-06-23T20:24:39.960Z" }
        ]
      }
        await chai.request(server)
        .post('/sensors')
        .set('content-type', 'application/json')
        .send(postData)
        .then( response => {
           chai.request(server)
            .get(`/sensors`)
            .end((err, res) => {
              res.statusCode.should.equal(200)
              res.body.should.have.property('min')
              res.body.should.have.property('max')
              res.body.should.have.property('averages')
            })
        })
    })
  })
})