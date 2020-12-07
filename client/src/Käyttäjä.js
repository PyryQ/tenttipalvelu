import axios from 'axios';
import {useEffect, useState, useReducer} from 'react';
import { Input } from '@material-ui/core';

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
      setKäyttäjänTiedot(käyttäjä.data)
    }
    haeKäyttäjänData(k_sähköposti)
  },[])

  console.log(käyttäjänTiedot)
  //let käyttäjä = await axios.get("http://localhost:4000/kayttajantiedot/" + k_sähköposti)
  return <div>
    Käyttäjän sähköposti:
    <br></br>
    <Input defaultValue={k_sähköposti}></Input>
    Käyttäjän etunimi:
    </div>;
}