import axios from 'axios';
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from '@material-ui/core/Button';
//'@material-ui/core/Button';
import "./App.css";

export default function Login() {
  const [käyttäjänSähköposti, setKäyttäjänSähköposti] = useState("");
  const [käyttäjänSalasana, setKäyttäjänSalasana] = useState("");
  const [salasananTarkistus, setSalasananTarkistus] = useState("")
  const [salasanaOikein, setSalasanaOikein] = useState("ei ole onnistunut");

  function validateForm() {
    return käyttäjänSalasana.length > 0 && käyttäjänSähköposti.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  useEffect(()=>{
    const haeKäyttäjänSalasana = async () => {
        console.log(käyttäjänSalasana)
        if(käyttäjänSalasana != ""){
            let tietokantaSalasana = await axios.get("http://localhost:4000/kayttajansalasana/" + käyttäjänSähköposti)
            console.log(tietokantaSalasana.data[0].salasana)
            setSalasananTarkistus(tietokantaSalasana.data[0].salasana)
        }
    }
    haeKäyttäjänSalasana()
    },[tarkistaSalasana])


  function tarkistaSalasana() {
    if (käyttäjänSalasana == salasananTarkistus){
        setSalasanaOikein("onnistui")
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Sähköposti: </Form.Label>
          <Form.Control
            autoFocus
            type="email"
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
        <Button block size="lg" type="submit" disabled={!validateForm()} onClick={() => tarkistaSalasana()}>
          Kirjaudu
        </Button>
    <div> Kirjautuminen: {salasanaOikein}</div>
      </Form>
    </div>
  );
}