import axios from 'axios';
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
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



//https://www.npmjs.com/package/jsonwebtoken
//HS256



export default function Login(props) {
  const classes = useStyles();
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


  const tarkistaKirjautuminen = async () => {
    if(käyttäjänSalasana != ""){
      console.log("Salasanan tarkistukseen tullaan")
      try {
        let tietokantaToken = await axios.post("http://localhost:4000/tarkistasalasana", {sahkoposti: käyttäjänSähköposti, salasana: käyttäjänSalasana})
        //let tietokantaSalasana = await axios.get("http://localhost:4000/kayttajansalasana/" + käyttäjänSähköposti +"/"+käyttäjänSalasana)
        console.log(tietokantaToken.data)

        if (tietokantaToken.data != "" && tietokantaToken.data != undefined && tietokantaToken.data != null){
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
    {/* // <div action="login" method="post"className="Login" key="kirjautuminen1">
    //   <Form onSubmit={handleSubmit}>
    //     <Form.Group size="lg" controlId="email">
    //       <Form.Label>Sähköposti: </Form.Label>
    //       <Form.Control
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
    </div> */}


    
      <div>
        <TextField
          id="outlined-required"
          label="Sähköposti"
          variant="outlined"
          onChange={(e) => setKäyttäjänSähköposti(e.target.value)}
        />
        <TextField
          id="outlined-required"
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
    </div>
  );
}