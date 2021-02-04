
const express = require('express')
var cors = require("cors")
var app = express()
var router = express.Router();
const path = require('path')
app.use(express.static('./client/build'))

const httpServer = require('http').createServer(app)

var bodyParser = require("body-parser")
app.use(bodyParser.json())

module.exports = app
const db = require('./db')
const port =  process.env.PORT || 4000

// Salaus
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const SALT_ROUNDS = 9

const fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
}));


//-----------------WEBSOCKET---------------------------
var appOrigin = null
var con_string = null
if (!process.env.HEROKU){
  con_string = 'tcp://postgres:MnoP1994@localhost/Tenttikanta';
  appOrigin = 'http://localhost:3000'
  console.log("front: " + appOrigin)
}
else {
  con_string = process.env.DATABASE_URL
  appOrigin = 'https://tenttipalvelu.herokuapp.com'
  console.log("front: " + appOrigin)
}

var corsOptions = {
  origin: appOrigin,
  optionsSuccessStatus: 200
  //methods: "GET,PUT,POST,DELETE"
}

app.use(cors(corsOptions))

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io')) //static socket.io

const io = require('socket.io')(httpServer, {
  cors: {
    origin: appOrigin,
    methods: ["GET", "POST"]
  }
})


app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io'))

var pg = require('pg');

var pg_client = new pg.Client(con_string);
pg_client.connect();

var query = pg_client.query('LISTEN tenttilisatty');

var query2 = pg_client.query('LISTEN uusikayttaja');

var query3 = pg_client.query('LISTEN aikamuuttui');


io.on('connection', function (socket) {
  socket.emit('connected', { connected: true });
  console.log("socket connected")
  socket.on('ready for data', function (data) {

    console.log("socket ready for data")

    pg_client.on('notification', function (title) {

      if (title.channel == 'aikamuuttui') {
        var viesti = JSON.parse(title.payload);
        socket.emit('update', { message: viesti.row.nimi + ", Aloitusaika: " + viesti.row.tentin_aloitusaika + ", Lopetusaika: " + viesti.row.tentin_aloitusaika });
        socket.send(viesti.row.nimi)
      }
      else {
        var viesti = JSON.parse(title.payload);
        socket.emit('update', { message: viesti.viesti });
        socket.send(title)
      }
    });
  });
}); 

process.on('uncaughtException', function (err) {
  console.log(err);
}); 


//----------------------------Router---------------------------------------
var lisays = require('./router/lisays.js');
app.use('/lisays', lisays);

var paivitys = require('./router/paivitys.js');
app.use('/paivitys', paivitys);

var poista = require('./router/poista.js');
app.use('/poista', poista);


//---------------------------------------------------POST------------------------------------

//Lisää käyttäjä
app.post('/lisaakayttaja', (req, res, next) => {

  let annettuSähköposti = req.body.sahkoposti
  let annettuSalasana = req.body.salasana
  try {
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
  } catch { console.log("Käyttäjän lisääminen ei onnistunut") }

})

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


//-----------------TIEDOSTOT----------------

app.post('/upload', function (req, res) {
  console.log("upload")

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let newFile = req.files.file;


  //ESIMERKKIKOODIN TIEDOSTONKÄSITTELYÄ

  let date = Date.now().toString();
  let fileName = 'Vastaus' + date + '.pdf'
  newFile.mv(fileName, function (err) {
    if (err) {
      return res.status(500).send(err)
    } else {

      parser.parseBankTransactions(fileName, (items) => {

        return res.json(items);

      });
    }
  });
});


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

//Käyttäjät
app.get('/kayttajat', (req, res, next) => {
  db.query('SELECT käyttäjä_id AS id, etunimi, sukunimi, sähköposti, rooli FROM käyttäjä', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

app.get('/kayttajantiedottokenista/:token', (req, res, next) => {
  let käyttäjänToken = req.params.token
  let tokenSähköposti
  jwt.verify(käyttäjänToken, 'sonSALAisuus', function (err, decoded) {
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

  jwt.verify(käyttäjänToken, 'sonSALAisuus', function (err, decoded) {
    tokenRooli = decoded.rooli
    tokenSähköposti = decoded.sähköposti
  })

  db.query("SELECT rooli FROM käyttäjä WHERE sähköposti = $1",
    [tokenSähköposti], (err, result) => {

      if (err) {
        return next(err)
      }
      if (tokenRooli === "admin" && result.rows[0].rooli === "admin") {
        res.send(true)
      }
      else res.send(false)
    })
})


//-------------------------------------------LOGIN---------------------------------

//Tarkistetaan salasana
app.post('/tarkistasalasana', (req, res, next) => {
  console.log("index, tarkista salasana")
  let annettuSalasana = req.body.salasana
  let annettuSähköposti = req.body.sahkoposti
  try {
    db.query("SELECT salasana, rooli FROM käyttäjä WHERE sähköposti = $1",
      [req.body.sahkoposti], (err, result) => {

        if (result.rows.length === 0) {
          console.log("Käyttäjää ei löydy.")
          return res.send(null)
        }

        if (err) {
          return res.send(null)
        }

        try {
          bcrypt.compare(annettuSalasana, result.rows[0].salasana, function (err, resultB) {
            if (resultB) {
              let token = jwt.sign({ sähköposti: annettuSähköposti, rooli: result.rows[0].rooli }, 'sonSALAisuus', { expiresIn: '4h' });
              console.log("tokenin asetus onnistui")
              return res.send(token)
            }
            else { "Salasanan tarkistus ei onnistunut." }
          });
        }
        catch (error) { console.log(error)}

      })
  } catch { "Salasanan tarkistus ei onnistunut." }
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



//---------------

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname +'/client/build/index.html'))
})

// app.listen(port, () => {
//   console.log("Palvelin käynnistyi portissa: " + port)
// })

var serverTest = app.listen(process.env.PORT || 4000, function () {
  var portTest = serverTest.address().port;
  console.log("Express is working on port " + portTest);
});





