const express = require('express')
var cors = require("cors")
var app = express()
var router = express.Router();

app.use(cors({
     origin: 'http://localhost:3000',
     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
   }))


var bodyParser = require("body-parser")
app.use(bodyParser.json())

module.exports = app
const db = require('./db')

const port = 4000

const bcrypt = require('bcrypt')

//passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
opts.secretOrKey = 'sonSALAisuus';
// use passport session
// var session = require("express-session"),
//     bodyParser = require("body-parser");



const BCRYPT_SALT_ROUNDS = 12;
//app.use(passport.initialize());
//app.use(passport.session());
//app.use(flash());
// routes should be at the last



//routertestailua
var lisays = require('./router/lisays.js');
app.use('/lisays', lisays);

var paivitys = require('./router/paivitys.js');
app.use('/paivitys', paivitys);

var poista = require('./router/poista.js');
app.use('/poista', poista);


// var kirjautuminen = require('./router/kirjautuminen.js');
// app.use('/kirjautuminen', kirjautuminen);










//-----------------------Token- ja hashesimerkkejä


var jwt = require('jsonwebtoken');


// console.log(token)
const SALT_ROUNDS = 9



// var middleware = {
//   vainAdmin: function (req, res, next){
  
//     let onkoOikeidet = false;
//     console.log("tarkistustoken " + req)

//     jwt.verify(req, 'sonSALAisuus', function(err, decoded) {
//       console.log(decoded.rooli)
//       //voimassaoloaika
//       if (decoded.rooli === "admin"){
//         onkoOikeidet = true;
//       }
//     });

//     if (onkoOikeidet){
//       next()
//     }
//     else return "ei onnistu"
//   }
// }

// app.use(middleware.vainAdmin)




//---------------------------------------------------POST------------------------------------

//Lisää käyttäjä
app.post('/lisaakayttaja', (req, res, next) => {

  let annettuSähköposti = req.body.sahkoposti
  let annettuSalasana = req.body.salasana

  try{
    db.query("INSERT INTO käyttäjä (etunimi, sukunimi, sähköposti, rooli) values ($1, $2, $3, $4) RETURNING sähköposti;", 
    [req.body.etunimi, req.body.sukunimi, req.body.sahkoposti, req.body.rooli], (err, result) => { 
      if (err) {
        return res.send(false) 
      }

      bcrypt.hash(req.body.salasana, SALT_ROUNDS, (err, hash) => {
        db.query("UPDATE käyttäjä SET salasana = $1 WHERE sähköposti = $2", 
        [hash, annettuSähköposti], (err, result) => { 
          if (err) {
            // sähköposti on jo käytössä
            return res.send(false) 
            //return next(error)
          }
          return res.send(true) 
        })
      });

    }) 
  } catch {console.log("Käyttäjän lisääminen ei onnistunut")}

})

app.post('/lisaakayttaja2', (req, res, next) => {
  db.query("INSERT INTO käyttäjä (etunimi, sukunimi, sähköposti, rooli, salasana) values ($1, $2, $3, $4, $5);", 
  [req.body.etunimi, req.body.sukunimi, req.body.sahkoposti, req.body.rooli, req.body.salasana], (err, result) => { 
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
    res.send(result.rows8)
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



app.get('/kayttajantiedottokenista/:token', (req, res, next) => {
  let käyttäjänToken = req.params.token
  let tokenSähköposti
  jwt.verify(käyttäjänToken, 'sonSALAisuus', function(err, decoded) {
    tokenSähköposti = decoded.sähköposti
  })
  db.query("SELECT etunimi, sukunimi, sähköposti, rooli FROM käyttäjä WHERE sähköposti = $1", 
  [tokenSähköposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})




app.get('/tarkistarooli/:token', (req, res, next) => {

  let käyttäjänToken = req.params.token  
  let tokenRooli;
  let tokenSähköposti;

  jwt.verify(käyttäjänToken, 'sonSALAisuus', function(err, decoded) {
    tokenRooli = decoded.rooli
    tokenSähköposti = decoded.sähköposti
  })

  db.query("SELECT rooli FROM käyttäjä WHERE sähköposti = $1", 
    [tokenSähköposti], (err, result) => {

      if (err) {
        return next(err)
      }
      if (tokenRooli === "admin" && result.rows[0].rooli === "admin"){
        res.send(true)
      }
      else res.send(false)

  })
})




//-------------------------------------------LOGIN---------------------------------


//https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

//Tarkistetaan salasana
app.post('/tarkistasalasana', (req, res, next) => {
  let annettuSalasana = req.body.salasana
  let annettuSähköposti = req.body.sahkoposti
  db.query("SELECT salasana, rooli FROM käyttäjä WHERE sähköposti = $1", 
  [req.body.sahkoposti], (err, result) => {

    if (err) {
      return next(err)
    }

    try {
    bcrypt.compare(annettuSalasana, result.rows[0].salasana, function(err, resultB) {
      if (resultB){
        const token = jwt.sign({ sähköposti: annettuSähköposti, rooli: result.rows[0].rooli }, 'sonSALAisuus', {expiresIn: '4h'});
        return res.send(token)
        }
      });
    }
    catch {"Salasanan tarkistus ei onnistunut"}

  })
})

app.get('/kayttajansalasana/:sahkoposti/:salasana', (req, res, next) => {
  db.query("SELECT salasana FROM käyttäjä WHERE sähköposti = $1", 
  [req.params.sahkoposti], (err, result) => {
    //console.log(req.params.salasana)
    console.log(result.rows[0])

    if (err) {
      return next(err)
    }

    res.send(result.rows)
  })
})


//Käyttäjän salasana
app.get('/kirjautuminen/:sahkoposti', (req, res, next) => {
  db.query("SELECT salasana FROM käyttäjä WHERE sähköposti = $1", 
  [req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

app.post('/kirjaudu', (req, res, next) => {
  db.query("SELECT salasana FROM käyttäjä WHERE sähköposti = $1", 
  [req.body.sähköposti, req.body.salasana], (err, result) => {
    if (err) {
      return next(err)
    }
    console.log(result.rows)
    res.send(result.rows)
  })
});


//--------------------------------------------PUT----------------------------------------------




//päivitä oikea vastaus
app.put('/paivitaoikeavastaus', (req, res, next) => {
  db.query("UPDATE vastaus SET oikea_vastaus = $2 WHERE vastaus_id = $1;", 
  [req.body.vastaus_id, req.body.oikein], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(req.body)
  })
})

app.put('/paivitaetunimi', (req, res, next) => {
  db.query("UPDATE käyttäjä SET etunimi = $2 WHERE sähköposti = $1;", 
  [req.body.sähköposti, req.body.etunimi], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(req.body)
  })
})

app.put('/paivitasukunimi', (req, res, next) => {
  db.query("UPDATE käyttäjä SET sukunimi = $2 WHERE sähköposti = $1;", 
  [req.body.sähköposti, req.body.sukunimi], (err, result) => { 
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
