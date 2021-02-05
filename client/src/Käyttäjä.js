import axios from 'axios';
import { useEffect, useState } from 'react';
import { Input } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import strings from './Localization.js'
import { käyttäjänTiedotTokenista, poistaKäyttäjä } from './HttpKutsut';
import Button from '@material-ui/core/Button';

export default function Käyttäjä(props) {

  const [käyttäjänEtunimi, setKäyttäjänEtunimi] = useState("") //Käytettiin datan käsittelyssä ennen statea
  const [käyttäjänSukunimi, setKäyttäjänSukunimi] = useState("") //Serveriä varten
  const [käyttäjänTiedot, setKäyttäjänTiedot] = useState()
  let path = 'http://localhost:4000/'
  let k_token = props.käyttäjänToken

  useEffect(() => {
    const haeKäyttäjänData = async (token) => {

      käyttäjänTiedotTokenista(token).then((result) => {
        //Tarkistetaan serverin palauttama arvo
        if (result.data === null || result.data === "" || result.data === undefined || result.data === false) {
          alert(strings.somethingWrong)
        }
        else {
          setKäyttäjänTiedot(result.data[0])
          setKäyttäjänEtunimi(result.data[0].etunimi)
          setKäyttäjänSukunimi(result.data[0].sukunimi)
          alert(strings.userSuccesful)
        }
      })
    }
    haeKäyttäjänData(k_token)
  }, [])

  const päivitäEtunimi = async (k_etunimi) => {
    console.log(käyttäjänTiedot)
    let etunimi = await axios.put(path + "paivitaetunimi", { etunimi: k_etunimi, sähköposti: käyttäjänTiedot.sähköposti })
    setKäyttäjänEtunimi(etunimi)
  }

  const päivitäSukunimi = async (k_sukunimi) => {
    let sukunimi = await axios.put(path + "paivitasukunimi", { sukunimi: k_sukunimi, sähköposti: käyttäjänTiedot.sähköposti })
    setKäyttäjänSukunimi(sukunimi)
  }

  async function poistaTämäKäyttäjä(käyttäjänToken) {

    poistaKäyttäjä(käyttäjänToken).then((result) => {
      if (result === true) {
        alert("Käyttäjän poisto onnistui.")
        props.poistuminen()
      }
      else {
        alert("Käyttäjän poisto epäonnistui.")
        console.log("Käyttäjän poisto epäonnistui.")
      }

    })
  }

  if (käyttäjänTiedot !== null && käyttäjänTiedot !== undefined) {
    return <div><Card>
      {strings.email}: {käyttäjänTiedot.sähköposti}
      <br></br>
      {strings.firstname}: <Input defaultValue={käyttäjänTiedot.etunimi} onChange={(e) => päivitäEtunimi(e.target.value)}></Input>
      <br></br>
      {strings.lastname}: <Input defaultValue={käyttäjänTiedot.sukunimi} onChange={(e) => päivitäSukunimi(e.target.value)}></Input>
      <br></br>
      {strings.role}: {käyttäjänTiedot.rooli}
    </Card>
      <Button className="poistaTT"
        onClick={() => {
          if (window.confirm("Poista käyttäjätietosi?")) {
            poistaTämäKäyttäjä();
          }
        }}>Poista käyttäjä</Button>
    </div>


  } else return null
}