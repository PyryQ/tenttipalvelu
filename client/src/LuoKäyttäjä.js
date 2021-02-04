import axios from 'axios';
import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import "./App.css";
import strings from './Localization';
import { lisääKäyttäjä } from './HttpKutsut'


export default function Login(props) {
  //Muuttujat käyttäjän tietojen tallentamiseksi
  const [käyttäjänSähköposti, setKäyttäjänSähköposti] = useState("");
  const [käyttäjänSalasana, setKäyttäjänSalasana] = useState("");
  const [käyttäjänSalasana2, setKäyttäjänSalasana2] = useState("");
  const [käyttäjänEtunimi, setKäyttäjänEtunimi] = useState("");
  const [käyttäjänSukunimi, setKäyttäjänSukunimi] = useState("");
  const [käyttäjänRooli, setKäyttäjänRooli] = useState("");
  const [käyttäjänRooliTarkistus, setKäyttäjänRooliTarkistus] = useState("");

  //Tarkistetaan syötteet, mikäli ne ovat kunnossa, lisätään käyttäjä tietokantaan
  const luoKäyttäjä = async () => {
    try {
      //Salasanan vaatimukset täyttyvät
      if (!tarkistaSalasana(käyttäjänSalasana)) {
        alert(strings.passwordNotice);
      }

      //Sähköposti annettu oikeassa muodossa
      else if (!tarkistaSähköposti(käyttäjänSähköposti)) {
        alert(strings.invalidEmail);
      }

      //Salasanat täsmäävät
      else if (käyttäjänSalasana !== käyttäjänSalasana2) {
        alert(strings.unmatchPassword);
      }

      //Nimet eivät ole tyhjät
      else if (käyttäjänEtunimi !== "" && käyttäjänSukunimi !== "" && käyttäjänEtunimi.length > 0) {

        //Roolisalasana oikein
        if (käyttäjänRooliTarkistus == "admin1234" || käyttäjänRooliTarkistus == "oppilas") {
          if (käyttäjänRooliTarkistus == "admin1234") {
            setKäyttäjänRooli("admin")
          }
          else { setKäyttäjänRooli("oppilas") }
          console.log(käyttäjänRooli)

          if (käyttäjänRooli != "") {
            //Lisätään käyttäjän tiedot yhteen muuttujaan ja lähetetään tietokantaan
            let käyttäjänTiedot = { etunimi: käyttäjänEtunimi, sukunimi: käyttäjänSukunimi, sahkoposti: käyttäjänSähköposti, rooli: käyttäjänRooli, salasana: käyttäjänSalasana }
            lisääKäyttäjä(käyttäjänTiedot).then((result) => {
              //Tarkistetaan serverin palauttama arvo
              if (result === null || result === "" || result === undefined || result === false) {
                alert(strings.somethingWrong)
              }
              else alert(strings.userSuccesful)
            })
          }
          else alert(strings.somethingWrong)
        }
        else alert(strings.incorrectRolePW)
      }
      else alert(strings.unfilledForm);
    }
    catch (error) {
      alert(strings.somethingWrong)
      console.log(error)
    }
  }

  function tarkistaSähköposti(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function tarkistaSalasana(str) {
    //Vähintään yksi numero, yksi pieni ja yksi iso kirjain
    //Vähintään kuusi merkkiä
    var res = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return res.test(str);
  }

  return (
    // Sisäänkirjautumisen form
    <div className="rekisteröidy">
      <div className="kirjautuminen-kohdat">
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

        {strings.adminPasswordQuide}
        <br className="lomake-br" />
        <p><TextField
          id="kirjaudu-rooli"
          label={strings.rolePassword}
          type="password"
          variant="outlined"
          onChange={(e) => (setKäyttäjänRooliTarkistus(e.target.value))}
        /></p>
        <br className="lomake-br" />
        <Button block size="lg" onClick={() => luoKäyttäjä()}>
          {strings.register}
        </Button>
      </div>
    </div>
  );
}