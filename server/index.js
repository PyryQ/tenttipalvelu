const express = require('express')
var cors = require("cors")
var bodyParser = require("body-parser")

const app = express()
module.exports = app

const port = 4000

app.use(bodyParser.json())
app.use(cors())

const db = require('./db')

//cascade
//https://kb.objectrocket.com/postgresql/how-to-use-the-postgresql-delete-cascade-1369#:~:text=In%20PostgreSQL%2C%20a%20cascade%20means,key%20relationship%20is%20in%20place


////////////////////////////////////// GET

//Hae tentti id:n mukaan
app.get('/tentti/:id', (req, res, next) => {
  db.query('SELECT * FROM tentti WHERE tentti_id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

app.get('/tentit', (req, res, next) => {
  db.query('SELECT * FROM tentti', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Kaikki tentin kysymykset
app.get('/kysymykset/:tentti_id', (req, res, next) => {
  db.query('SELECT * FROM kysymys WHERE tentti_id_fk = $1',
  [req.params.tentti_id], (err, result) => {
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
app.get('/vastaukset/:kysymys_id', (req, res, next) => {
  db.query('SELECT * FROM vastaus WHERE kysymys_id_fk = $1',
  [req.params.kysymys_id], (err, result) => {
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

//Käyttäjän tentit
app.get('/kayttajantentit/:sahkoposti', (req, res, next) => {
  db.query('SELECT * FROM käyttäjäntentti WHERE käyttäjä_id_fk = (SELECT käyttäjä_id FROM käyttäjä WHERE sähköposti=$1)', 
  [req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Käyttäjän vastaukset
app.get('/kayttajanvastaukset/:sahkoposti', (req, res, next) => {
  db.query('SELECT * FROM käyttäjänvastaus WHERE käyttäjä_id_fk = (SELECT käyttäjä_id FROM käyttäjä WHERE sähköposti=$1)', 
  [req.params.sahkoposti], (err, result) => {
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
    res.send(result.rows[0])
  })
})





///////////////////////////////POST

//lisää tentti
app.post('/lisaatentti/:nimi/:tp/:mp/:ta/:tl/:pr', (req, res, next) => {
  db.query("INSERT INTO tentti (nimi, tenttipisteet, minimipisteet, tentin_aloitusaika, tentin_lopetusaika, pisterajat) values ($1, $2, $3, $4, $5, $6);", 
  [req.params.nimi, req.params.tp, req.params.mp, req.params.ta, req.params.tl, req.params.pr], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send("Tentin lisäys onnistui")
  })
})
//http://localhost:4000/lisaatentti/TenttiNimi/30/10/2021-01-01 12:00:00/2021-01-01 14:00:00/pisterajat

//lisää kysymys
app.post('/lisaakysymys/:tentti_id/:kysymys/:pisteet/', (req, res, next) => {
  db.query("INSERT INTO kysymys (tentti_id_fk, kysymys, kysymyspisteet) VALUES ($1, $2, $3);", 
  [req.params.tentti_id, req.params.kysymys, req.params.pisteet], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("Kysymyksen lisäys onnistui")
  })

})

//lisää vastaus
app.post('/lisaavastaus/:kysymys_id/:vastaus/:oikea_vastaus', (req, res, next) => {
  db.query("INSERT INTO vastaus (kysymys_id_fk, vastaus, oikea_vastaus) VALUES ($1, $2, $3);", 
  [req.params.kysymys_id, req.params.vastaus, req.params.oikea_vastaus], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("Vastauksen lisäys onnistui")
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





//////////////////////PUT

//päivitä tentti
app.put('/paivitatentti/:tentti_id/:uusinimi/:tp/:mp/:ta/:tl/:pr', (req, res, next) => {
  db.query("UPDATE tentti SET nimi = $2, tenttipisteet = $3, minimipisteet = $4, tentin_aloitusaika = $5, tentin_lopetusaika = $6, pisterajat = $7  WHERE tentti_id=$1;", 
  [req.params.tentti_id, req.params.uusinimi, req.params.tp, req.params.mp, req.params.ta, req.params.tl, req.params.pr], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.row)
  })
})
//http://localhost:4000/paivitatentti/Merkkitentti/Merkkitentti päivitetty/30/10/2021-03-03 20:00:00/2021-03-03 22:00:00/pisterajat

//päivitä kysymys
app.post('/paivitakysymys/:tentti_id/:uusiKysymys/:pisteet/', (req, res, next) => {
  db.query("INSERT INTO kysymys kysymys = $2, kysymyspisteet = 3$ WHERE tentti_id_fk = $1;", 
  [req.params.uusiKysymys, req.params.pisteet, req.params.tentti_nimi], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

//lisää vastaus
app.post('/lisaavastaus/:kysymys_id/:vastaus/:oikea_vastaus', (req, res, next) => {
  db.query("INSERT INTO vastaus (vastaus, oikea_vastaus, kysymys_id_fk) VALUES ($1, $2, $3);", 
  [req.params.kysymys_id, req.params.vastaus, req.params.oikea_vastaus], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send()
  })
})




///////////////////////// DELETE

app.delete('/poistakayttaja/:sahkoposti', (req, res, next) => {
  db.query("DELETE FROM käyttäjä WHERE sähköposti=$1;", [req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})
// http://localhost:4000/poistakayttaja/sahkopostit

app.delete('/poistatentti/:tentti_id', (req, res, next) => {
  db.query("DELETE FROM tentti WHERE tentti_id = $1;", [req.params.tentti_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

app.delete('/poistakysymys/:kysymys', (req, res, next) => {
  db.query("DELETE FROM kysymys WHERE kysymys=$1;", [req.params.kysymys], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

app.delete('/poistavastaus/:vastaus', (req, res, next) => {
  db.query("DELETE FROM vastaus WHERE vastaus=$1;", [req.params.vastaus], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

app.delete('/poistakayttajantentti/:tentti_nimi/:sahkoposti', (req, res, next) => {
  db.query("DELETE FROM kayttajantentti WHERE tentti_id_fk = (SELECT tentti_id FROM tentti WHERE nimi=$1) AND käyttäjä_id_fk = (SELECT käyttäjä_id FROM käyttäjä WHERE sähköposti=$2);", 
  [req.params.tentti_nimi, req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

app.delete('/poistakayttajanvastaus/:vastaus/:sahkoposti', (req, res, next) => {
  db.query("DELETE FROM vastaus WHERE vastaus_id_fk = (SELECT vastaus_id FROM vastaus WHERE vastaus=$1) AND käyttäjä_id_fk = (SELECT käyttäjä_id FROM käyttäjä WHERE sähköposti=$2);", 
  [req.params.vastaus, req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
