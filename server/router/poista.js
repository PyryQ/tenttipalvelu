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
      console.log("tarkistustoken " + req.params.token)
  
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


router.delete('/poistatentti/:tentti_id', (req, res, next) => {
    db.query("DELETE FROM tentti WHERE tentti_id = $1;", [req.params.tentti_id], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
  })
  
router.delete('/poistakysymys/:kysymys_id', (req, res, next) => {
    db.query("DELETE FROM kysymys WHERE kysymys_id=$1;", [req.params.kysymys_id], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
  })
  
router.delete('/poistavastaus/:vastaus_id', (req, res, next) => {
    db.query("DELETE FROM vastaus WHERE vastaus_id =$1;", [req.params.vastaus_id], (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
})


 router.delete('/poistakayttaja/:sahkoposti', (req, res, next) => {
    db.query("DELETE FROM käyttäjä WHERE sähköposti=$1;", [req.params.sahkoposti], (err, result) => {
        if (err) {
            return next(err)
        }
        res.send(result)
    })
})


module.exports = router;