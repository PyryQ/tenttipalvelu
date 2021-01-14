import axios from 'axios';
import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import "./App.css";

import TextField from '@material-ui/core/TextField';
import strings from './Localization';


//Käyttäjältä pyydetään sähköposti ja salasana
//Mikäli kirjautuminen onnistuu, asetetaan käyttäjälle token 
//ja asetetaan kirjautuminen onnistuneeksi
export default function Login(props) {

  //Alustetaan muuttujat käyttäjän salasanalle 
  const [käyttäjänSähköposti, setKäyttäjänSähköposti] = useState("");
  const [käyttäjänSalasana, setKäyttäjänSalasana] = useState("");


  //Tarkistetaan onko käyttäjän kirjatumisyritys validi
  const tarkistaKirjautuminen = async () => {
    if(käyttäjänSalasana !== "" && käyttäjänSähköposti !== ""){
      try {
        //Verrataan sähköpostia ja salasanaa tietokantaa vasten
        let tietokantaToken = await axios.post("http://localhost:4000/tarkistasalasana", {sahkoposti: käyttäjänSähköposti, salasana: käyttäjänSalasana})
        console.log(tietokantaToken.data)
        //Mikäli token on validi, tallennetaan token ja merkitään kirjautuminen onnistuneeksi
        if (tietokantaToken.data !== "" && tietokantaToken.data !== undefined && tietokantaToken.data !== null){
          alert(strings.LoginSuccessful)
          props.asetaToken(tietokantaToken.data)
          props.kirjautuminen(true)
        }
        else alert(strings.LoginFailed)
      
      }catch {
        alert(strings.LoginFailed)
        console.log("Tokenin asettamisessa jotain pielessä.")
      }
    }
    else alert(strings.LoginFailed)
  }

  return (
    // Sisäänkirjautumisen kohdat
    <div className="kirjaudu">
      <p><TextField
        id="login-sähköposti"
        label={strings.email}
        variant="outlined"
        onChange={(e) => setKäyttäjänSähköposti(e.target.value)}
      /></p>
      <TextField
        id="login-salasana"
        label={strings.password}
        type="password"
        variant="outlined"
        onChange={(e) => setKäyttäjänSalasana(e.target.value)}
      />
      <br></br>
      <Button block size="lg" onClick={() => tarkistaKirjautuminen()}>
        {strings.login}
      </Button>

    </div>
  );
}