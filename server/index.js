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
//Hae tentti id:n mukaan
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
app.get('/kysymykset', (req, res, next) => {
  db.query('SELECT * FROM kysymys', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Kaikki kysymyksen vastaukset
app.get('/vastaukset/:kysymys', (req, res, next) => {
  db.query('SELECT * FROM vastaus WHERE kysymys_id_fk = (SELECT kysymys_id FROM kysymys WHERE kysymys = $1)',
  [req.params.nimi], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Kaikki käyttäjät
app.get('/kayttajat', (req, res, next) => {
  db.query('SELECT * FROM käyttäjä', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})



//Käyttäjän rooli
app.get('/kayttajanrooli/:sahkoposti', (req, res, next) => {
  db.query("SELECT rooli FROM käyttäjä WHERE sähköposti = $1", 
  [req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.row[0])
  })
})


///////////////POST
//lisää tentti
app.post('/lisaatentti/:nimi/:tp/:mp/:ta/:tl/:pr', (req, res, next) => {
  db.query("INSERT INTO tentti (nimi, tenttipisteet, minimipisteet, tentin_aloitusaika, tentin_lopetusaika, pisterajat) values ($1, $2, $3, $4, $5, $6);", 
  [req.params.nimi, req.params.tp, req.params.mp, req.params.ta, req.params.tl, req.params.pr], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.row[0])
  })
})

//lisää kysymys
app.post('/lisaakysymys/:kysymys/:pisteet/:tentti_nimi', (req, res, next) => {
  db.query("INSERT INTO kysymys (kysymys, kysymyspisteet, tentti_id_fk) VALUES ($1, $2, (SELECT tentti_id FROM tentti WHERE nimi=$3));", 
  [req.params.kysymys, req.params.pisteet, req.params.tentti_nimi], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(result)
  })

})

//lisää vastaus
app.post('/lisaavastaus/:vastaus/:oikea_vastaus/:kysymys_nimi', (req, res, next) => {
  db.query("INSERT INTO vastaus (vastaus, oikea_vastaus, kysymys_id_fk) VALUES ($1, $2, (SELECT kysymys_id FROM kysymys WHERE kysymys=$3));", 
  [req.params.vastaus, req.params.oikea_vastaus, req.params.kysymys_nimi], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send()
  })
})

//Lisää käyttäjä
app.post('/lisaakayttja/:en/:sn/:sp/:r/:ss', (req, res, next) => {
  db.query("INSERT INTO käyttäjä (etunimi, sukunimi, sähköposti, rooli, salasana) values ($1, $2, $3, $4, $5);", 
  [req.params.en, req.params.sn, req.params.sp, req.params.r, req.params.ss], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(result)
  }) 
})
//http://localhost:4000/lisaakayttaja/testi/testinen/testaus/kayttaja/salasana12345

//Lisää käyttäjän vastaus
app.post('/lisaakayttajanvastaus/:k-sp/:vastaus/:k_valinta/:v_oikein', (req, res, next) => {
  db.query("INSERT INTO käyttäjänvastaus (käyttäjä_id_fk, vastaus_id_fk, käyttäjän_valinta, vastaus_oikein) VALUES ((SELECT käyttäjä_id_id FROM käyttäjä WHERE sähköposti='testi@testi.fi'), (SELECT vastaus_id FROM vastaus WHERE vastaus='Testivastaus 1'), $3, $4);", 
  [req.params.k-sp, req.params.vastaus, req.params.k_valinta, req.params.v_oikein], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("onnistui")
  }) 
})

///////////////// DELETE
app.delete('/poistakayttaja/:sahkoposti', (req, res, next) => {
  db.query("DELETE FROM käyttäjä WHERE sähköposti=$1;", [req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})
// http://localhost:4000/poistakayttaja/sahkopostit


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


////// DELETE

//Poistetaan tentti





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
