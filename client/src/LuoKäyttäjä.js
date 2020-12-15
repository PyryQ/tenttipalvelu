import axios from 'axios';
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from '@material-ui/core/Button';
//'@material-ui/core/Button';
import "./App.css";
import kirjauduttu from "./App.js"
import asetaSähköposti from "./App.js"

export default function Login(props) {
  const [käyttäjänSähköposti, setKäyttäjänSähköposti] = useState("");
  const [käyttäjänSalasana, setKäyttäjänSalasana] = useState("");
  const [käyttäjänEtunimi, setKäyttäjänEtunimi] = useState("");
  const [käyttäjänSukunimi, setKäyttäjänSukunimi] = useState("");
  const [käyttäjänRooli, setKäyttäjänRooli] = useState("");
  const [käyttäjänRooliTarkistus, setKäyttäjänRooliTarkistus] = useState("");

  const [tiedotPätevät, setTiedotPätevät] = useState(false);
  const [salasananTarkistus, setSalasananTarkistus] = useState("")
  const [salasanaOikein, setSalasanaOikein] = useState(false);

  const luoKäyttäjä = async () => {
    console.log("validointiin tullaan")
    if (käyttäjänSalasana < 5){
      alert("Salasanan pitää olla vähintään 5 merkkiä pitkä.");
    }
    else if (käyttäjänSalasana.length > 0 && käyttäjänSähköposti.length > 0 && käyttäjänEtunimi.length > 0 && käyttäjänSähköposti.length > 0){
      if (käyttäjänRooliTarkistus === "admin1234" || käyttäjänRooliTarkistus === "oppilas"){
        if (käyttäjänRooliTarkistus === "admin1234"){
          setKäyttäjänRooli("admin")
        }
        else setKäyttäjänRooli("oppilas")

        let käyttäjänTiedot = {etunimi: käyttäjänEtunimi, sukunimi: käyttäjänSukunimi, sahkoposti: käyttäjänSähköposti, rooli: käyttäjänRooli, salasana: käyttäjänSalasana}
        let tietokantaKäyttäjä = await axios.post("http://localhost:4000/lisaakayttaja", käyttäjänTiedot)
        
        alert("Käyttäjän luonti onnistui!")
      }
      else alert("Roolin asettaminen ei onnistunut")
    }
    else alert("Jokin kohta puuttuu.");
  }

  function handleSubmit(event) {
    event.preventDefault();
  }


  return (
    // Sisäänkirjautumisen form
    <div className="Login">
      <Form onSubmit={handleSubmit}>
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
      </Form>
    </div>
  );
}