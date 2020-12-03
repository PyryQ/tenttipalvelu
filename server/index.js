const express = require('express')
var cors = require("cors")
var bodyParser = require("body-parser")
const app = express()
module.exports = app
const db = require('./db')

const port = 4000

app.use(bodyParser.json())
app.use(cors())




//---------------------------------------------------POST------------------------------------

//Lisää tentti (lisää defaultarvot tietokantaan?)
app.post('/lisaatentti/:nimi', (req, res, next) => {
  db.query("INSERT INTO tentti (nimi) values ($1);", 
  [req.params.nimi], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send("Tentin lisäys onnistui")
  })
})
//http://localhost:4000/lisaatentti/TenttiNimi/30/10/2021-01-01 12:00:00/2021-01-01 14:00:00/pisterajat
//( to_timestamp )

//Lisää kysymys
app.post('/lisaakysymys/:tentti_id/:kysymys/:pisteet', (req, res, next) => {
  db.query("INSERT INTO kysymys (tentti_id_fk, kysymys, kysymyspisteet) VALUES ($1, $2, $3);", 
  [req.params.tentti_id, req.params.kysymys, req.params.pisteet], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("Kysymyksen lisäys onnistui")
  })

})

//Lisää vastaus
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
app.post('/lisaakayttaja/:en/:sn/:sp/:r/:ss', (req, res, next) => {
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
app.post('/lisaakayttajanvastaus/:k_id/:v_id/:k_valinta/:v_oikein', (req, res, next) => {
  db.query("INSERT INTO käyttäjänvastaus (käyttäjä_id_fk, vastaus_id_fk, käyttäjän_valinta, vastaus_oikein) VALUES ($1, $2, $3, $4);", 
  [req.params.k_id, req.params.v_id, req.params.k_valinta, req.params.v_oikein], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("onnistui")
  }) 
})

//Lisää käyttäjän tentti
app.post('/lisaakayttajantentti/:k_id/:t_id/:pm/:arvos/:t_tehty', (req, res, next) => {
  db.query("INSERT INTO käyttäjäntentti (käyttäjä_id_fk, tentti_id_fk, pistemäärä, arvosana, tentti_tehty) VALUES ($1, $2, $3, $4, $5);", 
  [req.params.k_id, req.params.v_id, req.params.pm, req.params.arvos, req.params.t_tehty], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("onnistui")
  }) 
})





//------------------------------------------------ GET------------------------------------------

//Hae tentti id:n mukaan
app.get('/tentti/:id', (req, res, next) => {
  db.query('SELECT * FROM tentti WHERE tentti_id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Kaikki tentit
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
app.get('/kayttajantentit/:kayttaja_id', (req, res, next) => {
  db.query('SELECT * FROM käyttäjäntentti WHERE käyttäjä_id_fk = $1', 
  [req.params.kayttaja_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Käyttäjän tentti
app.get('/kayttajantentit/:kayttaja_id', (req, res, next) => {
  db.query('SELECT * FROM käyttäjäntentti WHERE käyttäjä_id_fk = $1', 
  [req.params.kayttaja_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Käyttäjän tentin vastaukset
app.get('/kayttajanvastaukset/:kayttaja_id/:vastaus_id', (req, res, next) => {
  db.query('SELECT * FROM käyttäjänvastaus WHERE käyttäjä_id_fk = $1 AND vastaus_id_fk = $2', 
  [req.params.kayttaja_id, req.params.vastaus_id], (err, result) => {
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
    res.send(result.rows)
  })
})






//--------------------------------------------PUT----------------------------------------------

//päivitä tentti
app.put('/paivitatentti/:tentti_id/:uusinimi/:tp/:mp/:ta/:tl/:pr', (req, res, next) => {
  db.query("UPDATE tentti SET nimi = $2, tenttipisteet = $3, minimipisteet = $4, tentin_aloitusaika = $5, tentin_lopetusaika = $6, pisterajat = $7  WHERE tentti_id=$1;", 
  [req.params.tentti_id, req.params.uusinimi, req.params.tp, req.params.mp, req.params.ta, req.params.tl, req.params.pr], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send("Tentin päivitys onnistui")
  })
})

//päivitä tentin nimi
app.put('/paivitatenttiteksti/:tentti_id/:uusinimi', (req, res, next) => {
  db.query("UPDATE tentti SET nimi = $2 WHERE tentti_id=$1;", 
  [req.params.tentti_id, req.params.uusinimi], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send("Tentin päivitys onnistui")
  })
})


//päivitä kysymys
app.put('/paivitakysymys/:tentti_id/:uusiKysymys/:pisteet/', (req, res, next) => {
  db.query("UPDATE kysymys SET kysymys = $2, kysymyspisteet = 3$ WHERE tentti_id_fk = $1;", 
  [req.params.tentti_id, req.params.uusiKysymys, req.params.pisteet], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("Kysymyksen päivitys onnistui")
  })
})

//päivitä kysymyksen teksti
app.put('/paivitakysymysteksti', (req, res, next) => {
  db.query("UPDATE kysymys SET kysymys = $2 WHERE kysymys_id = $1;", 
  [req.body.kysymys_id, req.body.kysymys], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("Kysymyksen päivitys onnistui")
  })
})

//päivitä vastaus
app.put('/paivitavastaus/:vastaus_id/:vastaus/:oikea_vastaus', (req, res, next) => {
  db.query("UPDATE vastaus SET vastaus = $2, oikea_vastaus = 3$ WHERE vastaus_id = $1;", 
  [req.params.vastaus_id, req.params.vastaus, req.params.oikea_vastaus], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("Vastauksen päivitys onnistui")
  })
})

//päivitä vastausteksti
app.put('/paivitavastausteksti', (req, res, next) => {
  db.query("UPDATE vastaus SET vastaus = $2 WHERE vastaus_id = $1;", 
  [req.body.v_id, req.body.v], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(req.body)
  })
})

//päivitä vastausteksti
app.put('/paivitaoikeavastaus', (req, res, next) => {
  db.query("UPDATE vastaus SET oikea_vastaus = $2 WHERE vastaus_id = $1;", 
  [req.body.vastaus_id, req.body.oikea_vastaus], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(req.body)
  })
})



//päivitä käyttäjän vastaus
app.put('/paivitakayttajanvastaus/:k_id/:v_id/:k_valinta/:v_oikein', (req, res, next) => {
  db.query("UPDATE käyttäjänvastaus SET käyttäjän_valinta = $3, vastaus_oikein = $4 WHERE käyttäjä_id_fk = $1 AND vastaus_id_fk = $2;", 
  [req.params.k_id, req.params.v_id, req.params.k_valinta, req.params.v_oikein], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send("Käyttäjän vastauksen päivitys onnistui")
  }) 
})



//------------------------------------- DELETE-----------------------------------------------

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

app.delete('/poistakysymys/:kysymys_id', (req, res, next) => {
  db.query("DELETE FROM kysymys WHERE kysymys_id=$1;", [req.params.kysymys_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

app.delete('/poistavastaus/:vastaus_id', (req, res, next) => {
  db.query("DELETE FROM vastaus WHERE vastaus_id =$1;", [req.params.vastaus_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

app.delete('/poistakayttajantentti/:kayttaja_id/:tentti_id', (req, res, next) => {
  db.query("DELETE FROM kayttajantentti WHERE käyttäjä_id_fk = $2 AND tentti_id_fk = $1;", 
  [req.params.kayttaja_id, req.params.tentti_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

app.delete('/poistakayttajanvastaus/:kayttaja_id/:vastaus_id', (req, res, next) => {
  db.query("DELETE FROM vastaus WHERE käyttäjä_id_fk = $2 AND vastaus_id_fk = $1;", 
  [req.params.kayttaja_id, req.params.vastaus_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
