const express = require('express')
var bodyParser = require('body-parser')

var router = express.Router();

router.use(bodyParser.json())
var jwt = require('jsonwebtoken');

const db = require('../db')
// console.log(token)
const SALT_ROUNDS = 9



function vainAdmin(req, res, next) {

  let onkoOikeidet = false

  jwt.verify(req.body.token, 'sonSALAisuus', function (err, decoded) {
    //voimassaoloaika
    if (decoded.rooli === "admin") {
      onkoOikeidet = true;
    }
  });

  if (onkoOikeidet) {
    next()
  }
  else return res.send(false)
}

router.delete('/poistatentti', vainAdmin, (req, res, next) => {
  db.query("DELETE FROM tentti WHERE tentti_id = $1;",
    [req.body.tentti_id], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
})

router.delete('/poistakysymys', vainAdmin, (req, res, next) => {
  db.query("DELETE FROM kysymys WHERE kysymys_id=$1;",
    [req.body.kysymys_id], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
})

router.delete('/poistavastaus', vainAdmin, (req, res, next) => {
  db.query("DELETE FROM vastaus WHERE vastaus_id =$1;",
    [req.body.vastaus_id], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
})

router.delete('/poistakayttaja/:sahkoposti', vainAdmin, (req, res, next) => {
  db.query("DELETE FROM käyttäjä WHERE sähköposti=$1;", [req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result)
  })
})

router.delete('/poistakayttajantentti/:kayttaja_id/:tentti_id', vainAdmin, (req, res, next) => {
  db.query("DELETE FROM kayttajantentti WHERE käyttäjä_id_fk = $2 AND tentti_id_fk = $1;",
    [req.params.kayttaja_id, req.params.tentti_id], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
})

router.delete('/poistakayttajanvastaus/:kayttaja_id/:vastaus_id', vainAdmin, (req, res, next) => {
  db.query("DELETE FROM vastaus WHERE käyttäjä_id_fk = $2 AND vastaus_id_fk = $1;",
    [req.params.kayttaja_id, req.params.vastaus_id], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
})

module.exports = router;