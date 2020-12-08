import axios from 'axios';
import {useEffect, useState, useReducer} from 'react';
import { Input } from '@material-ui/core';
import Card from '@material-ui/core/Card';

//useMemo-hahmottelua
  // //https://www.digitalocean.com/community/tutorials/react-usememo
  //https://www.robinwieruch.de/react-usememo-hook
  //https://reactjs.org/docs/react-api.html#reactmemo
  //https://dmitripavlutin.com/use-react-memo-wisely/
  // const KysymysMemo = React.memo(Kysymys, vertaa) => {
  //
  //}
  // vertaa(previousProps, nextProps){
  //   a = previousProps.index == nextProps.index
  //   b = previousProps.teksti == nextProps.teksti
  //   return a&&b
  // }

export default function Käyttäjä(props) {
  let k_sähköposti = props.sähköposti
  console.log(k_sähköposti)
  const [käyttäjänTiedot, setKäyttäjänTiedot]=useState()

  useEffect(()=>{
    const haeKäyttäjänData = async (sähköposti) => {
      let käyttäjä = await axios.get("http://localhost:4000/kayttajantiedot/" + sähköposti)
      console.log(käyttäjä.data)
      setKäyttäjänTiedot(käyttäjä.data[0])
      console.log(käyttäjänTiedot)
    }
    haeKäyttäjänData(k_sähköposti)
  },[])

  console.log(käyttäjänTiedot)
  //let käyttäjä = await axios.get("http://localhost:4000/kayttajantiedot/" + k_sähköposti)
  if (käyttäjänTiedot != null || käyttäjänTiedot != undefined){
    return <Card>
      Käyttäjän sähköposti: {k_sähköposti}
      <br></br>
      Käyttäjän etunimi: <Input defaultValue={käyttäjänTiedot.etunimi}></Input>
      <br></br>
      Käyttäjän sukunimi: <Input defaultValue={käyttäjänTiedot.sukunimi}></Input>
      <br></br>
      Käyttäjän rooli: {käyttäjänTiedot.rooli}
      <br></br>
      Käyttäjän salasana: *****
    </Card>
  } else return null
}