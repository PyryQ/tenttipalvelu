import React from 'react';
import {useEffect, useState, useReducer} from 'react';
import Fade from 'react-reveal/Fade';
import uuid from 'react-uuid';
import axios from 'axios'; //serverin käyttöä varten
//Muotoilua
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
//Muut komponentit js css
import './App.css';
import TulostaKysymykset from './TulostaKysymykset';
import MuokkaaKysymyksiä from './MuokkaaKysymyksiä';
import KaavioVaaka from './KaavioVaaka';
import Kaavio2 from './Kaavio2';
import Kaavio from './Kaavio';

// Kehitettävää: 
//aktiivisen tentin buttonille eri väri
// Kysymyskomponentti?
// reducer omaan tiedostoon?
// Muuttujien nimien selkeytys
// Kommentointia
// Hookit, onBlur?
// tekstittömän painikkeen muotoilu


function App() {

  const [data1, setData]=useState([]) //Käytettiin datan käsittelyssä ennen statea
  const [data2, setData2]=useState([]) //Serveriä varten
  const [dataAlustettu, setDataAlustettu] = useState(false) //Onko data alustettu
  const [dataAlustettu2, setDataAlustettu2] = useState(false) //Serveriä varten

  const [palautettu, setPalautettu] = useState(false) //Onko kysely palautettu
  const [tenttiValinta, settenttiValinta] = useState(0) //Mikä tenteistä on valittu
  const [näkymä, setNäkymä] = useState(1) //Vastaus- vai muokkausnäkymä

  //Alkuperäinen taulukko kyselyistä ja niiden vastauksista
  const kyselyt = []


  const kyselytkopio = [
    {uid: uuid(), nimi: "Numerovisa", kysely: [
      {uid: uuid(), kysymys: "Kuinka monta ihmistä on käynyt kuussa?", vastaukset: [
        {uid: uuid(), vastaus: "0", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "12", valittu: false, oikea_vastaus: true}, 
        {uid: uuid(), vastaus: "15", valittu: false, oikea_vastaus: false}
        ]},
      {uid: uuid(), kysymys: "Kuinka monta sanaa Potter-kirjasarjan suomennoksissa on yhteensä?", vastaukset: [
        {uid: uuid(), vastaus: "857 911", valittu: false, oikea_vastaus: true}, 
        {uid: uuid(), vastaus: "955 543", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "1 100 438", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "1 204 539", valittu: false, oikea_vastaus: false}
        ]},
      {uid: uuid(), kysymys: "Mikä seuraavista luvuista on lähinnä Tanskan asukasmäärää?", vastaukset: [
        {uid: uuid(), vastaus: "5,2 miljoonaa", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "5,6 miljoonaa", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "5,8 miljoonaa", valittu: false, oikea_vastaus: true}
        ]}]
    },
    {uid: uuid(), nimi: "Kirjainvisa", kysely: [
      {uid: uuid(), kysymys: "Mikä YMCA on suomeksi?", vastaukset: [
          {uid: uuid(), vastaus: "YMKY", valittu: false, oikea_vastaus: false}, 
          {uid: uuid(), vastaus: "NMKY", valittu: false, oikea_vastaus: true}, 
          {uid: uuid(), vastaus: "MNKY", valittu: false, oikea_vastaus: false}
        ]},
        {uid: uuid(), kysymys: "Mikä seuraavista on GIF?", vastaukset: [
          {uid: uuid(), vastaus: "graph iteration format", valittu: false, oikea_vastaus: false}, 
          {uid: uuid(), vastaus: "graphics interchange format", valittu: false, oikea_vastaus: true}, 
          {uid: uuid(), vastaus: "george iliott format", valittu: false, oikea_vastaus: false}
        ]},
        {uid: uuid(), kysymys: "Kuka on oikea_vastaus Ben?", vastaukset: [
          {uid: uuid(), vastaus: "Ben Zysgowicz", valittu: false, oikea_vastaus: false}, 
          {uid: uuid(), vastaus: "Ben Zyscowicz", valittu: false, oikea_vastaus: true}, 
          {uid: uuid(), vastaus: "Ben Zyskowicz", valittu: false, oikea_vastaus: false},
          {uid: uuid(), vastaus: "Ben Zysćowicz", valittu: false, oikea_vastaus: false}
        ]}]
      },
      {uid: uuid(), nimi: "Merkkivisa", kysely: [
        {uid: uuid(), kysymys: "Mikä seuraavista shakkipelin merkinnöistä tarkoittaa 'arveluttava siirto, mutta ei suoraan osoitettavissa virheeksi'?", vastaukset: [
            {uid: uuid(), vastaus: "?", valittu: false, oikea_vastaus: false}, 
            {uid: uuid(), vastaus: "??", valittu: false, oikea_vastaus: false}, 
            {uid: uuid(), vastaus: "?!", valittu: false, oikea_vastaus: true},
            {uid: uuid(), vastaus: "!?", valittu: false, oikea_vastaus: false}
           ]},
          {uid: uuid(), kysymys: "Mikä ‽ on englanninkieliseltä nimeltään?", vastaukset: [
            {uid: uuid(), vastaus: "Interrobang", valittu: false, oikea_vastaus: true}, 
            {uid: uuid(), vastaus: "Sulivabang", valittu: false, oikea_vastaus: false}, 
            {uid: uuid(), vastaus: "Guessbang", valittu: false, oikea_vastaus: false}
          ]},
          {uid: uuid(), kysymys: "Mitä matemaattinen merkki ∂ tarkoittaa?", vastaukset: [
            {uid: uuid(), vastaus: "Tyhjä joukko", valittu: false, oikea_vastaus: false}, 
            {uid: uuid(), vastaus: "Normaali aliryhmä", valittu: false, oikea_vastaus: true}, 
            {uid: uuid(), vastaus: "Gradientti", valittu: false, oikea_vastaus: false},
            {uid: uuid(), vastaus: "Osittaisderivaatta", valittu: false, oikea_vastaus: false}
          ]}
        ]
      }
    ]

  //data serverin datan muodostamista/testaamista varten
  //dataa käsitellään kuitenkinkyselyt listan pohjalta staten avulla
  const kyselytServeri = 
    [{uid: uuid(), nimi: "Numerovisa testi", kysely: [
      {uid: uuid(), kysymys: "Kuinka monta ihmistä on käynyt kuussa?", vastaukset: [
        {uid: uuid(), vastaus: "0", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "12", valittu: false, oikea_vastaus: true}, 
        {uid: uuid(), vastaus: "15", valittu: false, oikea_vastaus: false}
        ]},
      {uid: uuid(), kysymys: "Kuinka monta sanaa Potter-kirjasarjan suomennoksissa on yhteensä?", vastaukset: [
        {uid: uuid(), vastaus: "857 911", valittu: false, oikea_vastaus: true}, 
        {uid: uuid(), vastaus: "955 543", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "1 100 438", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "1 204 539", valittu: false, oikea_vastaus: false}
        ]},
      {uid: uuid(), kysymys: "Mikä seuraavista luvuista on lähinnä Tanskan asukasmäärää?", vastaukset: [
        {uid: uuid(), vastaus: "5,2 miljoonaa", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "5,6 miljoonaa", valittu: false, oikea_vastaus: false}, 
        {uid: uuid(), vastaus: "5,8 miljoonaa", valittu: false, oikea_vastaus: true}
        ]}
      ]
    }
  ]

  // Alustetaan state ja reducer kyselyn avulla
  const [state, dispatch] = useReducer(reducer, kyselyt);
        
  //Post, get ja put serverin datan testaamista varten. Ei käytössä ohjelmassa.
  useEffect(()=>{
    ////////////////////////////POST
    const createData = async () => {
      try{
        // let result = await axios.post("http://localhost:4000/tentit", result.data)
        // console.log(result.data.nimi)
        // if (result.data.length > 0)
        // for (var i = 0; i < result.data.length; i++){
        //   result.data[i].kysely = await axios.post("http://localhost:4000/kysymykset/" + result.data[i].tentti_id)
        // }
        // console.log(result.data)
        // dispatch({type: "INIT_DATA", data: result.data})
        // setData2(result.data)
        // setDataAlustettu2(true)
      }
      catch(exception){
        alert("Tietokannan alustaminen epäonnistui (Post)")
      }
    }
    /////////////////////////////GET
    const fetchData = async () => {
      try{
        let result = await axios.get("http://localhost:4000/tentit")

        //state pohjustetaan
        if (result.data.length > 0){
          for (var i = 0; i < result.data.length; i++){ //käydään läpi tentit
            result.data[i].kysely = []
            let kysymykset = await axios.get("http://localhost:4000/kysymykset/" + result.data[i].tentti_id)
            result.data[i].kysely = kysymykset.data

            if (result.data[i].kysely.length > 0){
              for (var j = 0; j < result.data[i].kysely.length; j++){ // käydään kysymykset
                result.data[i].kysely[j].vastaukset = []
                let vastaukset = await axios.get("http://localhost:4000/vastaukset/" + result.data[i].kysely[j].kysymys_id)
                result.data[i].kysely[j].vastaukset = vastaukset.data
              }
            }
            setData2(result.data);
            setDataAlustettu2(true)
          }
          dispatch({type: "INIT_DATA", data: result.data})
          console.log(result.data)
        }else{
          throw("Tietokannan alustaminen epäonnistui (Get)") 
        }
      }
      catch(exception){
        createData();
        console.log(exception)
      }
    }
    fetchData();
  },[])

  //////////////////////////////PUT
  // useEffect(() => {
  //   const updateData = async () => {
  //     try{
  //       let result = await axios.put("http://localhost:3001/kyselyt", state)
  //     }
  //     catch(exception){
  //       console.log("Dataa ei onnistuttu päivittämään.")
  //     }
  //   }
  //   if(dataAlustettu){
  //     updateData();
  //   }
  // },[state])

  // useEffect(() => {
  //   const updateTentti = async () => {
  //     try{
  //       let result = await axios.put("http://localhost:4000/paivitatentti/tentti_id/uusinimi/tp/mp/ta/tl/pr", state)
  //     }
  //     catch(exception){
  //       console.log("Dataa ei onnistuttu päivittämään.")
  //     }
  //   }
  //   if(dataAlustettu){
  //     updateTentti();
  //   }
  // },[state])

  // useEffect(() => {
  //   const updateData = async () => {
  //   try{
  //     let result = await axios.get("http://localhost:4000/tentit")

  //     //state pohjustetaan
  //     if (result.data.length > 0){
  //       for (var i = 0; i < result.data.length; i++){ //käydään läpi tentit
  //         result.data[i].kysely = []
  //         let kysymykset = await axios.get("http://localhost:4000/kysymykset/" + result.data[i].tentti_id)
  //         result.data[i].kysely = kysymykset.data

  //         if (result.data[i].kysely.length > 0){
  //           for (var j = 0; j < result.data[i].kysely.length; j++){ // käydään kysymykset
  //             result.data[i].kysely[j].vastaukset = []
  //             let vastaukset = await axios.get("http://localhost:4000/vastaukset/" + result.data[i].kysely[j].kysymys_id)
  //             result.data[i].kysely[j].vastaukset = vastaukset.data
  //           }
  //         }
  //         setData2(result.data);
  //         setDataAlustettu2(true)
  //       }
  //       dispatch({type: "INIT_DATA", data: result.data})
  //       console.log(result.data)
  //     }else{
  //       throw("Tietokannan alustaminen epäonnistui (Get)") 
  //     }
  //     }
  //     catch(exception){
  //       console.log(exception)
  //     }
  //   }
  // }

    

  // localStoragen data-avaimena on "data", joka alustetaan tässä
  useEffect(() => {
    let jemma = window.localStorage;
    let tempData = JSON.parse(jemma.getItem("data"))
    if (tempData == null) {
      jemma.setItem("data", JSON.stringify(kyselyt))
      tempData = kyselyt
    } 
    setData(tempData);
    setDataAlustettu(true)
  },[])


  // Päivitetään localStorage staten mukaan
  useEffect(() => {
    if (dataAlustettu) {
      window.localStorage.setItem("data", JSON.stringify(state))
    }
  }, [state])


  ////////////////////////////////MUOTOILUA

  //useStyles yläpalkin muotoilua varten
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    spacer: {
      flexGrow: 1,
    }
  }));
  const classes1 = useStyles();

  //Valmis painike fokuksen testaamiseksi
  const BootstrapButton = withStyles({
    root: {
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: 16,
      padding: '6px 12px',
      border: '1px solid',
      lineHeight: 1.5,
      backgroundColor: '#3f51b5',
      '&:hover': {
        backgroundColor: '#0069d9',
        borderColor: '#0062cc',
      },
      '&:active': {
        backgroundColor: '#0062cc',
        borderColor: '#005cbf',
      },
      '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
      } 
    },
  })(Button);
  const classesButton = useStyles();

  ///////////////////////////REDUCER
  
  function reducer(state, action) { //data tai state
    //ReferenceError: Cannot access 'syväKopio' before initialization
    //^^Mikäli syväkopiota kutsutaan caseissa
    //Siksi toistaiseksi oma syväkopio kaikille caseille
    let syväKopioR = JSON.parse(JSON.stringify(state)) //data vai state?
    switch (action.type) {
      case 'INIT_DATA':
        return action.data;
      case 'VASTAUS_VALITTU':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset[action.data.indexVa].valittu = action.data.valittuV
        return syväKopioR
      case 'MUUTA_VASTAUSTA':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset[action.data.indexVa].vastaus = action.data.vastaus
        return syväKopioR
      case 'MUUTA_OIKEA_VASTAUS':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset[action.data.indexVa].oikea_vastaus = action.data.valittuV
        return syväKopioR
      case 'LISÄÄ_VASTAUS':
        let uusiVastaus = {uid: uuid(), vastaus: "Uusi vastaus", valittu: false, oikea_vastaus: false}
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset.push(uusiVastaus)
        return syväKopioR
      case 'POISTA_VASTAUS':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset.splice(action.data.indexVa, 1)
        return syväKopioR
      case 'MUOKKAA_KYSYMYSTÄ':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].kysymys = action.data.kysymys
        return syväKopioR
      case 'LISÄÄ_KYSYMYS':
        let uusiKysymys =  {uid: uuid(), kysymys: "Uusi kysymys", vastaukset: []}
        syväKopioR[tenttiValinta].kysely.push(uusiKysymys)
        return syväKopioR
      case 'POISTA_KYSYMYS':
        syväKopioR[tenttiValinta].kysely.splice(action.data.indexKy, 1)
        return syväKopioR
      case 'MUOKKAA_TENTTI':
        syväKopioR[tenttiValinta].nimi = action.data.nimi
        return syväKopioR
      case 'LISÄÄ_TENTTI':
        let uusiTentti = {uid: uuid(), nimi: "Uusi tentti", kysely: []
        }
        syväKopioR.push(uusiTentti)
        return syväKopioR
      case 'POISTA_TENTTI':
        if(state.length > 1){
          syväKopioR.splice(tenttiValinta, 1)
        }
        return syväKopioR
      default:
        throw new Error();
    }
  }

  ////////////////////////////Muiden hookkien muistiinpanoja - useMemo - useRef
  //Dom puusta tietoa, useRef
  //Toinen hook, useMemo, jottei renderöidä turhuuksia
  //Laitetaan funktion vastaus muistiin, poimitaan vastausarvo
  //<Kysymys> const Kysymys </Kysymys>
  //const KysymysMemo = Read.memo(Kysymys)
  //compare(previousProps, nextProps){
  // a = previousProps.index == nextProps.index
  // b = previousProps.teksti == nextProps.teksti
  // return a&&b
  //const KysymysMemo = React.memo(Kysymys, compare)
  //useCallback, mikäli propseissa välitetään funktioita
  //}
  //onBlur, event, kun solusta poistutaan
  //codepen reactMemo
  //useRef, focuksen saamiseksi, esimerkiksi scroll-listan alimpaan elementtiin päästään käsiksi
  //const refContainer = useRef(initialValue)

  return (
    <div>
      {/*Yläpalkki navigointipainikkeineen*/}
      <div className={classes1.root}>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" edge="start" className={classes1.menuButton}>TENTIT</Button>
            <Button color="inherit">TIETOA SOVELLUKSESTA</Button>
            <Button variant="contained" color="secondary" onClick={() => setNäkymä(1)}>Näytä kysely</Button>
            <Button variant="contained" color="secondary" onClick={() => setNäkymä(2)}>Näytä kyselyn muokkaus</Button>
            <Button variant="contained" color="secondary" onClick={() => setNäkymä(3)}>Demot</Button>
            <div className={classes1.spacer}></div>
            <Button color="inherit">POISTU</Button>
          </Toolbar>
      </AppBar>
      </div>
      <br></br>

      <div>
        {/*Painikkeet kyselyn valintaa varten*/}
        {state.map((arvo, index) => <BootstrapButton key={"kyselypainike" + index} variant="contained" color="primary" 
          disableRipple className={classesButton.margin} 
          onClick={() => {settenttiValinta(index); setPalautettu(false);}}>{arvo.nimi}
        </BootstrapButton>) }
        <br/><br/>
        
        {/*Tarkistetaan, ettei state ole undefined*/}
        {state[tenttiValinta] != undefined ? 
          näkymä === 1 ? <div> {/*Näkymän mukaan tulostetaan*/}
            <Fade right><TulostaKysymykset
              dispatch={dispatch}
              kysymys={state[tenttiValinta]} 
              palautettu= {palautettu}/>
            </Fade>
            <br/>
            <Button variant={"contained"} color="primary" onClick={() => {setPalautettu(true);}}>Näytä vastaukset</Button>
            </div> : 
            näkymä === 2 ?
              <Fade right><MuokkaaKysymyksiä 
                dispatch={dispatch}
                kysymys={state[tenttiValinta]}/>
              </Fade> : <div>
                <Fade right>
                {/*<Kaavio/>*/}
                <Button variant="contained" color="secondary" onClick={() => console.log(data2)}>Data2</Button>
                <KaavioVaaka/>
                <br></br>

                </Fade>
              </div>
         : null }
        <br></br>
        <Button variant={"contained"} color="primary">Tyhjää muisti</Button>
        </div>
      </div>
  );
}

export default App;
