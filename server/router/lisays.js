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

//router.use(middleware.vainAdmin)




//----------------------------POST------------------------

//Lisää tentti (lisää defaultarvot tietokantaan?)
router.post('/lisaatentti/:token', middleware.vainAdmin, (req, res, next) => {
    db.query("INSERT INTO tentti (nimi) values ('Uusi tentti') RETURNING tentti_id;", (err, result) => {
      if (err) {
        return next(err)
      }
      return res.send(result.rows[0].tentti_id)
    })
  })
  //http://localhost:4000/lisaatentti/TenttiNimi/30/10/2021-01-01 12:00:00/2021-01-01 14:00:00/pisterajat
  //( to_timestamp )
  
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

  router.post('/lisaakayttajanvastaus/:vastaus_id/:vastaus/:token', middleware.vainAdmin, (req, res, next) => {
  
    console.log("käyttäjän vastauksen lisäys")
    let käyttäjänSähköposti
    var käyttäjänId
  
    //Käyttäjän sähköposti tokenista
    jwt.verify(req.params.token, 'sonSALAisuus', function(err, decoded) {
      //voimassaoloaika
      if (err){
        return res.send(false)
      }
      console.log(decoded.sähköposti)
      käyttäjänSähköposti = decoded.sähköposti
    });

  
    db.query("SELECT käyttäjä_id FROM käyttäjä WHERE sähköposti = $1", 
    [käyttäjänSähköposti], (err, result) => { 
        if (err) {
          return res.send(false)
      }
      console.log("käyttäjä_id query: " + result.rows[0].käyttäjä_id)
      käyttäjänId = result.rows[0].käyttäjä_id


      db.query("INSERT INTO käyttäjänvastaus (käyttäjä_id_fk, vastaus_id_fk, käyttäjän_valinta) values ($1, $2, $3)", 
      [käyttäjänId, req.params.vastaus_id, req.params.vastaus], (err, result) => { 
          if (err) {
            return res.send(false)
        }
        res.send("Vastauksen päivitys onnistui.")
      })

    })

  
    
    // db.query("INSERT INTO käyttäjänvastaus (käyttäjä_id_fk, vastaus_id_fk, käyttäjän_valinta) values ($1, $2, $3)", 
    // [käyttäjänId, req.params.vastaus_id, req.params.vastaus], (err, result) => { 
    //     if (err) {
    //       return res.send(false)
    //   }
    //   res.send("Vastauksen päivitys onnistui.")
    // })
  })





  module.exports = router;