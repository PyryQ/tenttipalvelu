import axios from 'axios';
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from '@material-ui/core/Button';
//'@material-ui/core/Button';
import "./App.css";



//https://www.npmjs.com/package/jsonwebtoken
//HS256



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

  // useEffect(()=>{
  //   const tarkistaKirjautuminen = async () => {
  //     if(käyttäjänSalasana != ""){
  //       console.log("Salasanan tarkistukseen tullaan")
  //       let tietokantaSalasana = await axios.get("http://localhost:4000/kayttajansalasana/" + käyttäjänSähköposti +"/"+käyttäjänSalasana)
  //       //let tietokantaSalasana = await axios.get("http://localhost:4000/kayttajansalasana/" + käyttäjänSähköposti +"/"+käyttäjänSalasana)
  //       setSalasananTarkistus(tietokantaSalasana.data[0].salasana)
  //     }
  //   }
  //   tarkistaKirjautuminen()
  //   },[tarkistaSalasana])


  const tarkistaKirjautuminen = async () => {
    if(käyttäjänSalasana != ""){
     console.log("Salasanan tarkistukseen tullaan")
     try {
      let tietokantaToken = await axios.post("http://localhost:4000/tarkistasalasana", {sahkoposti: käyttäjänSähköposti, salasana: käyttäjänSalasana})
      //let tietokantaSalasana = await axios.get("http://localhost:4000/kayttajansalasana/" + käyttäjänSähköposti +"/"+käyttäjänSalasana)
      console.log(tietokantaToken.data)

      if (tietokantaToken.data != "" && tietokantaToken.data != undefined && tietokantaToken.data != null){
        alert("Kirjautuminen onnistui")
        props.kirjautuminen(true)
      }
    
    }catch (Exception){
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
    <div action="login" method="post"className="Login" key="kirjautuminen1">
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
        <Button block size="lg" type="submit" onClick={() => tarkistaKirjautuminen()}>
          Kirjaudu
        </Button>
      </Form>
    </div>




    {/* <div className="Login">
      <Form onSubmit={handleSubmit}key="kirjautuminen2">
        <Form.Group size="lg" controlId="email">
          <Form.Label>Sähköposti: </Form.Label>
          <Form.Control
            autoFocus
            type="email"
            name="sähköposti"
            value={käyttäjänSähköposti}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="salasana">
          <Form.Label>Salasana: </Form.Label>
          <Form.Control
            type="password"
            name="salasana"
            value={käyttäjänSalasana}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Kirjaudu
        </Button>
      </Form>
    </div> */}


    <form action="http://localhost:4000/login" method="post" key="kirjautuminen3">
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