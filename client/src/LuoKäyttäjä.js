import axios from 'axios';
import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import "./App.css";

import strings from './Localization';


export default function Login(props) {
  const [käyttäjänSähköposti, setKäyttäjänSähköposti] = useState("");
  const [käyttäjänSalasana, setKäyttäjänSalasana] = useState("");
  const [käyttäjänSalasana2, setKäyttäjänSalasana2] = useState("");
  const [käyttäjänEtunimi, setKäyttäjänEtunimi] = useState("");
  const [käyttäjänSukunimi, setKäyttäjänSukunimi] = useState("");
  const [käyttäjänRooli, setKäyttäjänRooli] = useState("");
  const [käyttäjänRooliTarkistus, setKäyttäjänRooliTarkistus] = useState("");



  const luoKäyttäjä = async () => {

    if (!tarkistaSalasana(käyttäjänSalasana)){
      alert("Salasanassa tulee olla vähintään: \n - kuusi merkkiä \n - yksi numero \n - yksi pieni kirjain \n - yksi iso kirjain.");
    }

    else if(!tarkistaSähköposti(käyttäjänSähköposti)){
      alert("Sähköposti ei käy.");
    }

    else if(käyttäjänSalasana !== käyttäjänSalasana2){
      alert("Salasanat eivät täsmää.");
    }

    else if (käyttäjänEtunimi !== "" && käyttäjänSukunimi !== "" &&  käyttäjänEtunimi.length > 0){
      
      if (käyttäjänRooliTarkistus === "admin1234" || käyttäjänRooliTarkistus === "oppilas"){
        if (käyttäjänRooliTarkistus === "admin1234"){
          setKäyttäjänRooli("admin")
        }
        else {setKäyttäjänRooli("oppilas")}

        let käyttäjänTiedot = {etunimi: käyttäjänEtunimi, sukunimi: käyttäjänSukunimi, sahkoposti: käyttäjänSähköposti, rooli: käyttäjänRooli, salasana: käyttäjänSalasana}
        let tietokantaKäyttäjä = await axios.post("http://localhost:4000/lisaakayttaja", käyttäjänTiedot)
        if (tietokantaKäyttäjä.data === null || tietokantaKäyttäjä.data === "" || tietokantaKäyttäjä.data === undefined || tietokantaKäyttäjä.data === false){
          alert("Jokin meni pieleen.")
        }
        else alert("Käyttäjän luonti onnistui!")
      }
      else alert("Roolin asettaminen ei onnistunut")
    }
    else alert("Jokin kohta puuttuu.");
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
    <div className="rekisteröidy">
      <div className ="kirjautuminen-kohdat">
        <p><TextField
          id="kirjaudu-etunimi"
          label={strings.firstname}
          type="text"
          variant="outlined"
          onChange={(e) => setKäyttäjänEtunimi(e.target.value)}
        /></p>

        <p><TextField
          id="kirjaudu-sukunimi"
          label={strings.lastname}
          type="text"
          variant="outlined"
          onChange={(e) => setKäyttäjänSukunimi(e.target.value)}
        /></p>

        <p><TextField
          id="kirjaudu-sähköposti"
          label={strings.email}
          type="email"
          variant="outlined"
          onChange={(e) => setKäyttäjänSähköposti(e.target.value)}
        /></p>

        <p><TextField
          id="kirjaudu-salasana"
          label={strings.password}
          type="password"
          variant="outlined"
          onChange={(e) => setKäyttäjänSalasana(e.target.value)}
        /></p>

        <p><TextField
          id="kirjaudu-salasana2"
          label={strings.passwordAgain}
          type="password"
          variant="outlined"
          onChange={(e) => setKäyttäjänSalasana2(e.target.value)}
        /></p>

        Adminsalasana käyttöoikeuksille.
        Jos olet oppilas, kirjoita "oppilas".
        <br className="lomake-br"/>
        <p><TextField
          id="kirjaudu-rooli"
          label={strings.rolePassword}
          type="password"
          variant="outlined"
          onChange={(e) => (setKäyttäjänRooliTarkistus(e.target.value))}
        /></p>
        <br className="lomake-br"/>
        <Button block size="lg" onClick={() => luoKäyttäjä()}>
          {strings.register}
        </Button>

      </div>

    </div>
  );
}