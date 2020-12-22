import axios from 'axios';
import React, { useState } from "react";
import Button from '@material-ui/core/Button';
//'@material-ui/core/Button';
import "./App.css";

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
  const [käyttäjänSähköposti, setKäyttäjänSähköposti] = useState("");
  const [käyttäjänSalasana, setKäyttäjänSalasana] = useState("");


  const tarkistaKirjautuminen = async () => {
    if(käyttäjänSalasana !== ""){
      console.log("Salasanan tarkistukseen tullaan")
      try {
        let tietokantaToken = await axios.post("http://localhost:4000/tarkistasalasana", {sahkoposti: käyttäjänSähköposti, salasana: käyttäjänSalasana})
        //let tietokantaSalasana = await axios.get("http://localhost:4000/kayttajansalasana/" + käyttäjänSähköposti +"/"+käyttäjänSalasana)

        if (tietokantaToken.data !== "" && tietokantaToken.data !== undefined && tietokantaToken.data != null){
          alert("Kirjautuminen onnistui")
          props.asetaToken(tietokantaToken.data)
          props.kirjautuminen(true)
        }
      
      }catch {
        alert("Kirjautuminen ei onnistunut.")
        console.log("Tokenin asettamisessa jotain pielessä.")
      }
    }
  }


  //https://www.npmjs.com/package/bcrypt
  //https://www.npmjs.com/package/jsonwebtoken

  return (
    // Sisäänkirjautumisen form
    <div>
      <div className="kirjaudu">
        <TextField
          id="login-sähköposti"
          label="Sähköposti"
          variant="outlined"
          onChange={(e) => setKäyttäjänSähköposti(e.target.value)}
        />
        <TextField
          id="login-salasana"
          label="Salasana"
          type="password"
          variant="outlined"
          onChange={(e) => setKäyttäjänSalasana(e.target.value)}
        />
        <br></br>
        <Button block size="lg" onClick={() => tarkistaKirjautuminen()}>
          Kirjaudu
        </Button>

      </div>
    </div>
  );
}