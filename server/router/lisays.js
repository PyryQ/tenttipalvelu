const express = require('express')

var router = express.Router();

var jwt = require('jsonwebtoken');

const db = require('../db')
// console.log(token)
const SALT_ROUNDS = 9

var middleware = {
  vainAdmin: function (req, res, next){
  
    let onkoOikeidet = false;

    jwt.verify(req.params.token, 'sonSALAisuus', function(err, decoded) {
      //voimassaoloaika
      if (decoded.rooli === "admin"){
        onkoOikeidet = true;
      }
    });

    if (onkoOikeidet){
      next()
    }
    else return res.send(false)
  }
}



//----------------------------POST------------------------

//Lisää tentti
router.post('/lisaatentti/:token', middleware.vainAdmin, (req, res, next) => {
    db.query("INSERT INTO tentti (nimi) values ('Uusi tentti') RETURNING tentti_id;", (err, result) => {
      if (err) {
        return next(err)
      }
      return res.send(result.rows[0].tentti_id)
    })
  })
  
  //Lisää kysymys
  router.post('/lisaakysymys/:tentti_id/:token', middleware.vainAdmin, (req, res, next) => {
    db.query("INSERT INTO kysymys (tentti_id_fk, kysymys, kysymyspisteet) VALUES ($1, 'Uusi kysymys', 3) RETURNING kysymys_id;", 
    [req.params.tentti_id], (err, result) => { 
      if (err) {
        return next(err)
      }
      return res.send(result.rows[0].kysymys_id)
    })
  
  })
  
  //Lisää vastaus
  router.post('/lisaavastaus/:kysymys_id/:token', middleware.vainAdmin, (req, res, next) => {
      db.query("INSERT INTO vastaus (kysymys_id_fk, vastaus, oikea_vastaus) VALUES ($1, 'Uusi vastaus', false) RETURNING vastaus_id;", 
      [req.params.kysymys_id], (err, result) => { 
        if (err) {
          return next(err)
        }
        res.send(result.rows[0].vastaus_id)
      })
  
  })

router.post('/lisaakayttajanvastaus/:vastaus_id/:vastaus/:oikea_vastaus/:token', (req, res, next) => {
  
    let käyttäjänSähköposti
    var käyttäjänId
    let onkoVastausOikein = (req.params.oikea_vastaus === req.params.vastaus)
    console.log(onkoVastausOikein)
  
    //Käyttäjän sähköposti tokenista
    jwt.verify(req.params.token, 'sonSALAisuus', function(err, decoded) {
      //voimassaoloaika
      if (err){
        return res.send(null)
      }
      käyttäjänSähköposti = decoded.sähköposti
    });

    //Haetaan käyttäjän id sähköpostin perusteella
    db.query("SELECT käyttäjä_id FROM käyttäjä WHERE sähköposti = $1", 
    [käyttäjänSähköposti], (err, result) => { 
        if (err) {
          return res.send(null)
      }

      käyttäjänId = result.rows[0].käyttäjä_id

      //Tutkitaan, onko vastaukseen jo vastattu
      db.query("SELECT CASE WHEN EXISTS (SELECT 1 FROM käyttäjänvastaus WHERE käyttäjä_id_fk = $1 AND vastaus_id_fk = $2) THEN 1 ELSE 0 END", 
      [käyttäjänId, req.params.vastaus_id], (err, result2) => { 

        
        if (err) {
          return res.send(null)
        }

        else if (result2.rows[0].case === 1){ // Jos vastaava vastaus löytyy, päivitetään se         
          
          db.query("UPDATE käyttäjänvastaus SET käyttäjän_valinta = $3, vastaus_oikein = $4 WHERE käyttäjä_id_fk = $1 AND vastaus_id_fk = $2", 
          [käyttäjänId, req.params.vastaus_id, req.params.vastaus, onkoVastausOikein], (err, result) => { 
            if (err) {
              return res.send(null)
            }
            return res.send("Vastauksen päivitys onnistui.")
          })
        }

        else if (result2.rows[0].case === 0){ //Jos vastaavaa vastausta ei löydy, lisätään se
          
          db.query("INSERT INTO käyttäjänvastaus (käyttäjä_id_fk, vastaus_id_fk, käyttäjän_valinta, vastaus_oikein) values ($1, $2, $3, $4)", 
          [käyttäjänId, req.params.vastaus_id, req.params.vastaus, onkoVastausOikein], (err, result) => { 
            console.log("vastausta ei löydy")
            if (err) {
              return res.send(null)
            }
            return res.send("Vastauksen lisäys onnistui.")
          })
        }
        else {
          console.log("jokin meni pieleen")
          return res.send(null)
        }
      })
    })
  })

//Lisää kysymyksen tulos
router.post('/lisaakysymystulos/:kysymys_id/:tulos/:token', middleware.vainAdmin, (req, res, next) => {

  let käyttäjänSähköposti
  var käyttäjänId
    
  //Käyttäjän sähköposti tokenista
  jwt.verify(req.params.token, 'sonSALAisuus', function(err, decoded) {
    //voimassaoloaika
    if (err){
      return res.send(false)
    }
    käyttäjänSähköposti = decoded.sähköposti
  });
  
    
  db.query("SELECT käyttäjä_id FROM käyttäjä WHERE sähköposti = $1", 
    [käyttäjänSähköposti], (err, result) => { 
      if (err) {
        return res.send(false)
      }
      käyttäjänId = result.rows[0].käyttäjä_id
  
  
      db.query("INSERT INTO käyttäjänkysymystulos (kysymys_id_fk, vastaukset_oikein, käyttäjä_id_fk) VALUES ($1, $2, $3);", 
      [req.params.kysymys_id, req.params.tulos, käyttäjänId], (err, result) => { 
        if (err) {
          return res.send(false)
        }
        return res.send(true)
      })
    })
})

module.exports = router;