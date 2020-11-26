const express = require('express')
var cors = require("cors")
var bodyParser = require("body-parser")

const app = express()
module.exports = app

const port = 4000

app.use(bodyParser.json())
app.use(cors())

const db = require('./db')


////// GET
//Hae tentti id_n mukaan
app.get('/tentti/:id', (req, res, next) => {
  db.query('SELECT * FROM tentti WHERE tentti_id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
})

app.get('/tentti', (req, res, next) => {
  db.query('SELECT * FROM tentti', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})




//Kaikki kysymykset
app.get('/kysymys', (req, res, next) => {
  db.query('SELECT * FROM kysymys', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Kaikki käyttäjät
app.get('/kayttaja', (req, res, next) => {
  db.query('SELECT * FROM käyttäjä', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})


///////////////POST
app.post('/lisaatentti/:nimi/:tp/:minimipisteet/:ta/:tl/:pr', (req, res, next) => {
  db.query("INSERT INTO tentti (nimi, tenttipisteet, minimipisteet, tentin_aloitusaika, tentin_lopetusaika, pisterajat) values ($1, $2, $3, $4, $5, '0, hylätty, 5, kiitettävä');", 
  [req.params.nimi, req.params.tp, req.params.ta, req.params.tl, req.params.pr], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})





//testiping
app.get('/ping', (request, response) => {
  response.send('pong');
});

app.post('/', (req, res) => {
  res.send('Hello World! POST')
})

app.delete('/', (req, res) => {
  res.send('Hello World! DELETE')
})

app.put('/', (req, res) => {
  res.send('Hello World! PUT')
})


////// KYSYMYSTEN MUOKKAUS



////// VASTAUSTEN MUOKKAUS



////// KÄYTTÄJÄN MUOKKAUS




////// KÄYTTÄJÄN TENTTIEN MUOKKAUS



////// KÄYTTÄJÄN VASTAUSTEN MUOKKAUS




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
