import axios from 'axios';
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from '@material-ui/core/Button';
//'@material-ui/core/Button';
import "./App.css";


export default function Login(props) {
  const [käyttäjänSähköposti, setKäyttäjänSähköposti] = useState("");
  const [käyttäjänSalasana, setKäyttäjänSalasana] = useState("");
  const [salasananTarkistus, setSalasananTarkistus] = useState("")
  const [tietokantaHaku, setTietokantaHaku] = useState(false);

  function validateForm() {
    return käyttäjänSalasana.length > 0 && käyttäjänSähköposti.length > 0;
  }

  function handleSubmit(event) {
    console.log("handlesubmit")
    event.preventDefault();
  }

  useEffect(()=>{
    const tarkistaKäyttäjänSalasana = async () => {
      if(käyttäjänSalasana != ""){
        console.log("Salasanan tarkistukseen tullaan")
        let tietokantaSalasana = await axios.get("http://localhost:4000/kayttajansalasana/" + käyttäjänSähköposti)
        setSalasananTarkistus(tietokantaSalasana.data[0].salasana)
      }
    }
    tarkistaKäyttäjänSalasana()
    },[tietokantaHaku])


  function tarkistaSalasana() {
    setTietokantaHaku(true)
    console.log("salasanatarkistus")
    if (käyttäjänSalasana == salasananTarkistus){
      alert("Kirjautuminen onnistui!")
      props.käyttäjänOsoite(käyttäjänSähköposti)
      props.kirjautuminen(true)
    }
    else alert("Kirjautuminen ei onnistunut.")
  }


  //json webtoken
  //b crypt

  //https://www.npmjs.com/package/bcrypt
  //https://www.npmjs.com/package/jsonwebtoken

  return (
    // Sisäänkirjautumisen form
    <div>
    <div className="Login">
      <Form onSubmit={handleSubmit}>
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
        <Form.Group size="lg" controlId="salasana">
          <Form.Label>Salasana: </Form.Label>
          <Form.Control
            type="password"
            name="salasana"
            value={käyttäjänSalasana}
            onChange={(e) => setKäyttäjänSalasana(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" onClick={() => tarkistaSalasana()}>
          Kirjaudu
        </Button>
      </Form>
    </div>


    <form action="http://localhost:4000/login" method="post">
      <div>
        <label>Username:</label>
        <input type="text" name="username"/>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password"/>
      </div>
      <div>
        <input type="submit" value="Log In"/>
      </div>
    </form>
    </div>
  );
}