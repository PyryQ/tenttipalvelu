const express = require('express')
var bodyParser = require('body-parser')

var router = express.Router();

router.use(bodyParser.json())
var jwt = require('jsonwebtoken');

const db = require('../db')
// console.log(token)
const SALT_ROUNDS = 9



var middleware = {
    vainAdmin: function (req, res, next){
    
      let onkoOikeidet = false;
  
      jwt.verify(req.body.token, 'sonSALAisuus', function(err, decoded) {
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



router.put('/paivitatenttiteksti', middleware.vainAdmin, (req, res, next) => {
    db.query("UPDATE tentti SET nimi = $2 WHERE tentti_id=$1;", 
    [req.body.tentti_id, req.body.nimi], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send("Tentin päivitys onnistui.")
    })
  })



//päivitä kysymyksen teksti
router.put('/paivitakysymysteksti', middleware.vainAdmin, (req, res, next) => {
    db.query("UPDATE kysymys SET kysymys = $2 WHERE kysymys_id = $1;", 
    [req.body.kysymys_id, req.body.kysymys], (err, result) => { 
      if (err) {
        return next(err)
      }
      res.send("Kysymyksen päivitys onnistui.")
    })
  })


//Päivitä vastauksen teksti
router.put('/paivitavastausteksti', middleware.vainAdmin, (req, res, next) => {
    db.query("UPDATE vastaus SET vastaus = $2 WHERE vastaus_id = $1;", 
    [req.body.vastaus_id, req.body.vastaus], (err, result) => { 
        if (err) {
            return next(err)
      }
      res.send("Vastauksen päivitys onnistui.")
    })
  })

  //Päivitä käyttäjän vastaus
router.put('/paivitakayttajanvastaus', middleware.vainAdmin, (req, res, next) => {
  
  let käyttäjänSähköposti
  let käyttäjän_id

  jwt.verify(req.body.token, 'sonSALAisuus', function(err, decoded) {
    //voimassaoloaika
    if (err){
      return res.send(false)
    }
    käyttäjänSähköposti = decoded.sähköposti
  });

  db.query("SELECT käyttäjä_id WHERE sähköposti = $1", 
  [käyttäjänSähköposti], (err, result) => { 
      if (err) {
        return res.send(false)
    }
    console.log("käyttäjä_id: " + result.rows[0].käyttäjä_id)
    käyttäjän_id = result.rows[0].käyttäjä_id
  })

  
  db.query("INSERT INTO käyttäjänvastaus (käyttäjä_id_fk, vastaus_id_fk, käyttäjän_valinta) values ($1, $2, $3)", 
  [käyttäjän_id, req.body.vastaus_id, req.body.vastaus], (err, result) => { 
      if (err) {
        return res.send(false)
    }
    res.send("Vastauksen päivitys onnistui.")
  })
})


//päivitä oikea vastaus
router.put('/paivitaoikeavastaus', middleware.vainAdmin, (req, res, next) => {
  db.query("UPDATE vastaus SET oikea_vastaus = $2 WHERE vastaus_id = $1;", 
  [req.body.vastaus_id, req.body.oikein], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(req.body)
  })
})




//päivitä tentin aloitusaika
router.put('/paivitatenttialoitusaika', middleware.vainAdmin, (req, res, next) => {
  db.query("UPDATE tentti SET tentin_aloitusaika = $2 WHERE tentti_id=$1 RETURNING tentin_aloitusaika;", 
  [req.body.tentti_id, req.body.päiväjaaika], (err, result) => {
    if (err) {
      return res.send(false)
    }
    res.send(result.rows[0].tentin_aloitusaika)
  })
})

//päivitä tentin lopetusaika
router.put('/paivitatenttilopetusaika', middleware.vainAdmin, (req, res, next) => {
  db.query("UPDATE tentti SET tentin_lopetusaika = $2 WHERE tentti_id=$1 RETURNING tentin_lopetusaika;", 
  [req.body.tentti_id, req.body.päiväjaaika], (err, result) => {
    if (err) {
      return res.send(false)
    }
    res.send(result.rows[0].tentin_lopetusaika)
  })
})




module.exports = router;