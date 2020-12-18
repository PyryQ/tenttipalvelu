import axios from 'axios';
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from '@material-ui/core/Button';
//'@material-ui/core/Button';
import "./App.css";
import kirjauduttu from "./App.js"
import asetaSähköposti from "./App.js"

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function Login(props) {
  const classes = useStyles();
  const [käyttäjänSähköposti, setKäyttäjänSähköposti] = useState("");
  const [käyttäjänSalasana, setKäyttäjänSalasana] = useState("");
  const [käyttäjänSalasana2, setKäyttäjänSalasana2] = useState("");
  const [käyttäjänEtunimi, setKäyttäjänEtunimi] = useState("");
  const [käyttäjänSukunimi, setKäyttäjänSukunimi] = useState("");
  const [käyttäjänRooli, setKäyttäjänRooli] = useState("");
  const [käyttäjänRooliTarkistus, setKäyttäjänRooliTarkistus] = useState("");



  const luoKäyttäjä = async () => {
    console.log("validointiin tullaan")
    if (!tarkistaSalasana(käyttäjänSalasana)){
      alert("Salasanassa tulee olla vähintään: \n - kuusi merkkiä \n - yksi numero \n - yksi pieni kirjain \n - yksi iso kirjain.");
    }
    else if(!tarkistaSähköposti(käyttäjänSähköposti)){
      alert("Sähköposti ei käy.");
    }
    else if(käyttäjänSalasana != käyttäjänSalasana2){
      alert("Salasanat eivät täsmää.");
    }
    else if (käyttäjänEtunimi != "" && käyttäjänSukunimi != "" &&  käyttäjänEtunimi.length > 0){
      if (käyttäjänRooliTarkistus == "admin1234" || käyttäjänRooliTarkistus == "oppilas"){
        if (käyttäjänRooliTarkistus == "admin1234"){
          setKäyttäjänRooli("admin")
        }
        else {setKäyttäjänRooli("oppilas")}

        let käyttäjänTiedot = {etunimi: käyttäjänEtunimi, sukunimi: käyttäjänSukunimi, sahkoposti: käyttäjänSähköposti, rooli: käyttäjänRooli, salasana: käyttäjänSalasana}
        let tietokantaKäyttäjä = await axios.post("http://localhost:4000/lisaakayttaja", käyttäjänTiedot)
        if (tietokantaKäyttäjä.data == null || tietokantaKäyttäjä.data == "" || tietokantaKäyttäjä.data == undefined || tietokantaKäyttäjä.data == false){
          alert("Jokin meni pieleen.")
        }
        else {alert("Käyttäjän luonti onnistui!")}
      }
      else alert("Roolin asettaminen ei onnistunut")
    }
    else alert("Jokin kohta puuttuu.");
  }


  function handleSubmit(event) {
    event.preventDefault();
  }


  function tarkistaSähköposti(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function tarkistaSalasana(str){
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var res = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return res.test(str);
  }


  return (
    // Sisäänkirjautumisen form
    <div className="Login">
      {/* <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="text">
          <Form.Label>Etunimi: </Form.Label>
          <Form.Control
            type="text"
            value={käyttäjänEtunimi}
            onChange={(e) => setKäyttäjänEtunimi(e.target.value)}
          />

        </Form.Group>
        <Form.Group size="lg" controlId="text">
          <Form.Label>Sukunimi: </Form.Label>
          <Form.Control
            type="text"
            value={käyttäjänSukunimi}
            onChange={(e) => setKäyttäjänSukunimi(e.target.value)}
          />
        </Form.Group>

        <Form.Group size="lg" controlId="email">
          <Form.Label>Sähköposti: </Form.Label>
          <Form.Control
            autoFocus
            type="email"
            name="sähköposti"
            value={käyttäjänSähköposti}
            onChange={(e) => setKäyttäjänSähköposti(e.target.value)}
          />

        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Salasana: </Form.Label>
          <Form.Control
            type="password"
            value={käyttäjänSalasana}
            onChange={(e) => setKäyttäjänSalasana(e.target.value)}
          />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
          <Form.Label>Salasana uudelleen: </Form.Label>
          <Form.Control
            type="password"
            value={käyttäjänSalasana2}
            onChange={(e) => setKäyttäjänSalasana2(e.target.value)}
          />
        </Form.Group>
        <br></br>
        Adminsalasana käyttöoikeuksille.
        Jos olet oppilas, kirjoita "oppilas".
        <Form.Group size="lg" controlId="password">
          <Form.Label>Salasana: </Form.Label>
          <Form.Control
            type="password"
            value={käyttäjänRooliTarkistus}
            onChange={(e) => (setKäyttäjänRooliTarkistus(e.target.value))}
          />
        </Form.Group>
        <Button block size="lg" type="submit" onClick={() => luoKäyttäjä()}>
          Luo käyttäjä
        </Button>
      </Form> */}


      <div>
        <TextField
          id="outlined-required"
          label="Etunimi"
          variant="outlined"
          onChange={(e) => setKäyttäjänEtunimi(e.target.value)}
        />
        <br></br>
        <br></br>
        <TextField
          id="outlined-required"
          label="Sukunimi"
          variant="outlined"
          onChange={(e) => setKäyttäjänSukunimi(e.target.value)}
        />
        <br></br>
        <br></br>
        <TextField
          id="outlined-required"
          label="Sähköposti"
          type="email"
          variant="outlined"
          onChange={(e) => setKäyttäjänSähköposti(e.target.value)}
        />
        <br></br>
        <br></br>
        <TextField
          id="outlined-required"
          label="Salasana"
          type="password"
          variant="outlined"
          onChange={(e) => setKäyttäjänSalasana(e.target.value)}
        />
        <br></br>
        <br></br>
        <TextField
          id="outlined-required"
          label="Salasana uudelleen"
          type="password"
          variant="outlined"
          onChange={(e) => setKäyttäjänSalasana2(e.target.value)}
        />
        <br></br>
        <br></br>
        Adminsalasana käyttöoikeuksille.
        Jos olet oppilas, kirjoita "oppilas".
        <br></br>
        <TextField
          id="outlined-required"
          label="Roolisalasana"
          type="password"
          variant="outlined"
          onChange={(e) => (setKäyttäjänRooliTarkistus(e.target.value))}
        />
        <br></br>
        <br></br>
        <Button block size="lg" onClick={() => luoKäyttäjä()}>
          Luo käyttäjä
        </Button>

      </div>







      
    </div>
  );
}