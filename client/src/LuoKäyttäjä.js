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

  const [salasananTarkistus, setSalasananTarkistus] = useState("")
  const [salasanaOikein, setSalasanaOikein] = useState(false);

  function validateForm() {
    return käyttäjänSalasana.length > 0 && käyttäjänSähköposti.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

    useEffect(()=>{
        const luoKäyttäjä = async () => {
            if(käyttäjänSalasana != ""){
            let tietokantaSalasana = await axios.post("http://localhost:4000/kayttajansalasana/" + käyttäjänSähköposti)
        }
    }
    },[palautaKäyttäjänTiedot])


  function tarkistaRooli(rooli) {
    if (rooli == "admin1234"){
        setKäyttäjänRooliTarkistus("admin")
    }
    else if (rooli == "oppilas"){
        setKäyttäjänRooliTarkistus("oppilas")
    }
    else return ("Roolin asettaminen ei onnistunut")
  }

  function palautaKäyttäjänTiedot() {
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
            type="email"
            value={käyttäjänSähköposti}
            onChance={(e) => setKäyttäjänSähköposti(e.target.value)}
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
            value={käyttäjänRooli}
            onChange={(e) => (setKäyttäjänRooli(e.target.value), tarkistaRooli(e.target.value))}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()} onClick={() => palautaKäyttäjänTiedot()}>
          Luo käyttäjä
        </Button>
      </Form>
    </div>
  );
}