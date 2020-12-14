const express = require('express')
var cors = require("cors")
var app = express()

app.use(cors())

// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

var bodyParser = require("body-parser")
app.use(bodyParser.json())

module.exports = app
const db = require('./db')

const port = 4000
// connect flash for flash messages


// use passport session
// var session = require("express-session"),
//     bodyParser = require("body-parser");

const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
JWTstrategy = require('passport-jwt').Strategy
ExtractJWT = require('passport-jwt').ExtractJwt;
const BCRYPT_SALT_ROUNDS = 12;
//app.use(passport.initialize());
//app.use(passport.session());
//app.use(flash());
// routes should be at the last











//-----------------------Token- ja hashesimerkkejä


var jwt = require('jsonwebtoken');


// console.log(token)
const SALT_ROUNDS = 9



const vertaaHasheja = async (annettuSalasana, tietokantaSalasana) => {
  await bcrypt.compare(annettuSalasana, tietokantaSalasana, (err, result) => {
    console.log(result)
  });
}
let hashattySalasana


const asetaHash = () => {
  bcrypt.hash("kissa", SALT_ROUNDS, (err, hash) => {
    hashattysalasana = hash
    console.log(hash)
    return hash
  });
}



// try {
//   let tokenTulos = jwt.verify(token, 'shhhhh')
//     console.log(tokenTulos) // bar

// } catch(e){
//   console.log("Token ei käy.")
// }






//---------------------------------------------------POST------------------------------------

//Lisää tentti (lisää defaultarvot tietokantaan?)
app.post('/lisaatentti', (req, res, next) => {
  db.query("INSERT INTO tentti (nimi) values ('Uusi tentti') RETURNING tentti_id;", (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0].tentti_id)
  })
})
//http://localhost:4000/lisaatentti/TenttiNimi/30/10/2021-01-01 12:00:00/2021-01-01 14:00:00/pisterajat
//( to_timestamp )

//Lisää kysymys
app.post('/lisaakysymys/:tentti_id', (req, res, next) => {
  db.query("INSERT INTO kysymys (tentti_id_fk, kysymys, kysymyspisteet) VALUES ($1, 'Uusi kysymys', 3) RETURNING kysymys_id;", 
  [req.params.tentti_id], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(result.rows[0].kysymys_id)
  })

})

//Lisää vastaus
app.post('/lisaavastaus', (req, res, next) => {
    db.query("INSERT INTO vastaus (kysymys_id_fk, vastaus, oikea_vastaus) VALUES ($1, 'Uusi vastaus', false) RETURNING vastaus_id;", 
    [req.body.kysymys_id], (err, result) => { 
      if (err) {
        return next(err)
      }
      res.send(result.rows[0].vastaus_id)
    })

})

// app.post('/lisaavastaus/:kysymys_id/:vastaus/:oikea_vastaus', (req, res, next) => {
//   db.query("INSERT INTO vastaus (kysymys_id_fk, vastaus, oikea_vastaus) VALUES ($1, $2, $3) RETURNING vastaus_id;", 
//   [req.params.kysymys_id, req.params.vastaus, req.params.oikea_vastaus], (err, result) => { 
//     if (err) {
//       return next(err)
//     }
//     var uusi_vastaus_id = result.rows[0].vastaus_id
//     res.send(uusi_vastaus_id)
//   })
// })

//Lisää käyttäjä
app.post('/lisaakayttaja', (req, res, next) => {

  let annettuSähköposti = req.body.sahkoposti
  let annettuSalasana = req.body.salasana

  db.query("INSERT INTO käyttäjä (etunimi, sukunimi, sähköposti, rooli) values ($1, $2, $3, $4) RETURNING sähköposti;", 
  [req.body.etunimi, req.body.sukunimi, req.body.sahkoposti, req.body.rooli], (err, result) => { 
    if (err) {
      return next(err)
    }

    bcrypt.hash(req.body.salasana, SALT_ROUNDS, (err, hash) => {
      db.query("UPDATE käyttäjä SET salasana = $1 WHERE sähköposti = $2", 
      [hash, annettuSähköposti], (error, result) => { 
        console.log(hash)
        if (error) {
          return next(error)
        }
      })
    });

    res.send(result.rows[0].sähköposti) 
  }) 

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

//Käyttäjän tiedot
app.get('/kayttajantiedot/:sahkoposti', (req, res, next) => {
  db.query("SELECT * FROM käyttäjä WHERE sähköposti = $1", 
  [req.params.sahkoposti], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

//Käyttäjän salasana
app.get('/kayttajansalasana', (req, res, next) => {
  db.query("SELECT salasana FROM käyttäjä WHERE sähköposti = $1", 
  [req.body.sahkoposti, req.body.salasana], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})





// var tarkistaSalasana = function (req, res, next) {
//   if (req.tarkistaSalasana == req.annettuSalasana){
//     req.salasanaOikein = true;
//   }
//   next()
// }




//-----------SESSION

//req.logIn(user, { session: false });

//req.logIn(user, function(err) {
  //if (err) { throw err; }
  // session saved
//});




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
    console.log(result.rows[0].salasana)

    bcrypt.compare(annettuSalasana, result.rows[0].salasana, function(err, resultB) {
      if (resultB){
        var token = jwt.sign({ sähköposti: annettuSähköposti, rooli: result.rows[0].rooli }, 'sonSALAisuus');
        res.send(token)
      }
      
      
      console.log(resultB)
    });


    console.log(annettuSalasana)
    console.log(result.rows[0].salasana)
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

app.get('/kayttajansalasana2/:sahkoposti', (req, res, next) => {
  db.query("SELECT salasana FROM käyttäjä WHERE sähköposti = $1", 
  [req.params.sahkoposti], (err, result) => {
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





//http://www.passportjs.org/docs/downloads/html/
//app.use(flash());
//C:\Users\pyryq\harjoitus\tenttipalvelu\server\node_modules\passport\lib\http\request.js:46

// passport.use(
//   'login',
//   new LocalStrategy(
//     {
//       usernameField: 'sähköposti',
//       passwordField: 'salasana',
//       session: false
//     },
//     (username, password, done) => {
//       try {
//         console.log("täällä ollaan ja katotaan löytyykö käyttäjä")
//         app.get('/kayttajantiedot/:sahkoposti', (req, res, next) => {
//           db.query("SELECT * FROM käyttäjä WHERE sähköposti = $1", 
//           [username], (err, result) => {
//             console.log(result.rows)
//             let user = result.rows.sähköposti
//             if (err) {
//               return next(err)
//             }
//           })
//         }).then(user => {
//           if (user === null) {
//             return done(null, false, { message: 'bad username' });
//           } else {
//             bcrypt.compare(password, user.password).then(response => {
//               if (response !== true) {
//                 console.log('Salasanat eivät täsmää');
//                 return done(null, false, { message: 'passwords do not match' });
//               }
//               console.log('user found!');
//               //console.log(user);
//               // note the return needed with passport local - remove this return for passport JWT
//               return done(null, user);
//             });
//           }
//         });
//       } catch (err) {
//         done(err);
//       }
//     },
//   ),
// );


// var passport = require('passport')
//   , LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     console.log("käyttäjän tarkistukseen tultiin")

//     db.query("SELECT * FROM käyttäjä WHERE sähköposti = $1", 
//     [username], (err, result) => {
//       console.log(result.rows)
//       let user = result.rows
//       if (err) {return next(err)}

//       // if (!user.validPassword(password)) {
//       //   return done(null, false, { message: 'Incorrect password.' });
//       // }

//       let salasana = result.rows
//       return done(null, result.rows);
//     })


//      user.findOne({ sähköposti: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

// app.get('/api/users/me',
//   passport.authenticate('basic', { session: false }),
//   function(req, res) {
//     res.json({ id: req.user.id, username: req.user.username });
//   });


// app.get('/login', { successRedirect: 'http://localhost:3000/',
//                     failureRedirect: 'http://localhost:3000/',
//                     session: false
//                   },
// function(req, res, next) {
//   console.log("tänne tullaan")
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });

// app.post('/login',
//   passport.use('local', { successRedirect: 'http://localhost:3000/',
//                                    failureRedirect: 'http://localhost:3000/',
//                                    session: false
//                                   }),
//   function(req, res) {
//     console.log("Autentikointi onnistunut")
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/kayttajantiedot/' + req.user.username);
//   }                              
// );






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


//päivitä tentin aloitusaika
app.put('/paivitatenttialoitusaika', (req, res, next) => {
  db.query("UPDATE tentti SET tentin_aloitusaika = $2 WHERE tentti_id=$1 RETURNING tentin_aloitusaika;", 
  [req.body.tentti_id, req.body.päiväjaaika], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0].tentin_aloitusaika)
  })
})

//päivitä tentin lopetusaika
app.put('/paivitatenttilopetusaika', (req, res, next) => {
  db.query("UPDATE tentti SET tentin_lopetusaika = $2 WHERE tentti_id=$1 RETURNING tentin_lopetusaika;", 
  [req.body.tentti_id, req.body.päiväjaaika], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0].tentin_lopetusaika)
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
app.put('/paivitakysymysteksti/:kysymys_id/:kysymys', (req, res, next) => {
  db.query("UPDATE kysymys SET kysymys = $2 WHERE kysymys_id = $1;", 
  [req.params.kysymys_id, req.params.kysymys], (err, result) => { 
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
app.put('/paivitavastausteksti/:vastaus_id/:vastaus', (req, res, next) => {
  db.query("UPDATE vastaus SET vastaus = $2 WHERE vastaus_id = $1;", 
  [req.params.vastaus_id, req.params.vastaus], (err, result) => { 
    if (err) {
      return next(err)
    }
    res.send(req.body)
  })
})

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
