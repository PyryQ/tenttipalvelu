import axios from 'axios';
import {useEffect, useState, useReducer} from 'react';
import { Input } from '@material-ui/core';
import Card from '@material-ui/core/Card';

export default function Käyttäjä(props) {
  const [käyttäjänEtunimi, setKäyttäjänEtunimi]=useState("") //Käytettiin datan käsittelyssä ennen statea
  const [käyttäjänSukunimi, setKäyttäjänSukunimi]=useState("") //Serveriä varten

  let k_token = props.käyttäjänToken
  const [käyttäjänTiedot, setKäyttäjänTiedot]=useState()

  useEffect(()=>{
    const haeKäyttäjänData = async (token) => {
      let käyttäjä = await axios.get("http://localhost:4000/kayttajantiedottokenista/" + token)
      setKäyttäjänTiedot(käyttäjä.data[0])
      setKäyttäjänEtunimi(käyttäjä.data[0].etunimi)
      setKäyttäjänSukunimi(käyttäjä.data[0].sukunimi)
      console.log(käyttäjänEtunimi)
    }
    haeKäyttäjänData(k_token)
  },[])



  const päivitäEtunimi = async (k_etunimi) => {
    console.log("k_etunimi, " + k_etunimi)
    console.log(käyttäjänTiedot)
    let etunimi = await axios.put("http://localhost:4000/paivitaetunimi", {etunimi: k_etunimi, sähköposti: käyttäjänTiedot.sähköposti})
    setKäyttäjänEtunimi(etunimi)
  }

  const päivitäSukunimi = async (k_sukunimi) => {
    let sukunimi = await axios.put("http://localhost:4000/paivitasukunimi", {sukunimi: k_sukunimi, sähköposti: käyttäjänTiedot.sähköposti})
    setKäyttäjänSukunimi(sukunimi)
  }

  console.log(käyttäjänTiedot)
  //let käyttäjä = await axios.get("http://localhost:4000/kayttajantiedot/" + k_sähköposti)
  if (käyttäjänTiedot != null || käyttäjänTiedot != undefined){
    return <Card>
      Käyttäjän sähköposti: {käyttäjänTiedot.sähköposti}
      <br></br>
      Käyttäjän etunimi: <Input defaultValue={käyttäjänTiedot.etunimi} onChange={(e) => päivitäEtunimi(e.target.value)}></Input>
      <br></br>
      Käyttäjän sukunimi: <Input defaultValue={käyttäjänTiedot.sukunimi} onChange={(e) => päivitäSukunimi(e.target.value)}></Input>
      <br></br>
      Käyttäjän rooli: {käyttäjänTiedot.rooli}
    </Card>
  } else return null
}