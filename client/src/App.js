import React, {Component} from 'react';
import {useEffect, useState, useReducer} from 'react';
import Fade from 'react-reveal/Fade';
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
import Käyttäjä from './Käyttäjä';
import LuoKäyttäjä from './LuoKäyttäjä';
import Login from './Login';
import { tarkistaKäyttäjänRooli } from './HttpKutsut';
import Dropzone from './Dropzone';

import {useDropzone} from 'react-dropzone';

//Kuvat
import finland from './finland.png';
import unitedkingdom from './unitedkingdom.png';

//localization
import {setLanguage} from 'react-localization';
//const strings = require('./Localization.js');
import strings from './Localization.js'
//strings.setLanguage('fi');

//import parsiToken from'/server/index.js'


// Kehitettävää: 
// aktiivisen tentin buttonille eri väri
// Kysymyskomponentti?
// reducer omaan tiedostoon?
// Muuttujien nimien selkeytys
// Kommentointia
// kirjautuminen tarkistus popup
// käyttäjän sitominen vastauksiin
// pisteytys
// style omaan jsään?
// tokenin säilyminen?
// Käyttäjän tiedot

//Ohjelman päivitys? /token



function App() {

  const [data, setData] = useState(null)
  const [data2, setData2] = useState(null)
  const [dataAlustettu, setDataAlustettu] = useState(false) //Onko data alustettu
  const [dataAlustettu2, setDataAlustettu2] = useState(false) //Onko data alustettu

  const [palautettu, setPalautettu] = useState(false) //Onko kysely palautettu
  const [tenttiValinta, setTenttiValinta] = useState(0) //Mikä tenteistä on valittu
  const [näkymä, setNäkymä] = useState(4) //Vastaus- vai muokkausnäkymä
  const [käyttäjänToken, setKäyttäjänToken] = useState(null) //Token tietokannasta
  const [kirjauduttuSisään, setKirjauduttuSisään] = useState(false) //Onko kirjauduttu
  const kyselyt = []  //Pohja kyselyn muodostamiseksi

  // Alustetaan state ja reducer kyselyn avulla
  const [state, dispatch] = useReducer(reducer, kyselyt);

  const [kieli, setKieli] = useState('fi')

  //const lang ) navigator.language


  
        
  //Post, get ja put serverin datan testaamista varten. Ei käytössä ohjelmassa.
  useEffect(()=>{
    
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
        }else{
          throw("Tietokannan alustaminen epäonnistui (Get)") 
        }
      }
      catch(exception){
        //createData();
        console.log(exception)
      }
    }
    fetchData();
  },[])


  useEffect(()=>{
    strings.setLanguage(kieli);

  },[kieli])



  const updateData = async () => {
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
        }
        dispatch({type: "INIT_DATA", data: result.data})
        console.log(result.data)
      }else{
        throw("Tietokannan alustaminen epäonnistui (Get)") 
      }
      }
      catch(exception){
        console.log(exception)
      }
    }
    

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


  //--------------------------------------REDUCER
  
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
      case 'MUOKKAA_VASTAUSTA':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset[action.data.indexVa].vastaus = action.data.vastaus
        return syväKopioR
      case 'MUUTA_OIKEA_VASTAUS':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset[action.data.indexVa].oikea_vastaus = action.data.valittuV
        return syväKopioR
      case 'LISÄÄ_VASTAUS':
        let uusiVastaus = {vastaus: strings.newA, valittu: false, oikea_vastaus: false, vastaus_id: action.data.vastaus_id}
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset.push(uusiVastaus)
        return syväKopioR
      case 'POISTA_VASTAUS':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].vastaukset.splice(action.data.indexVa, 1)
        return syväKopioR
      case 'MUOKKAA_KYSYMYSTÄ':
        syväKopioR[tenttiValinta].kysely[action.data.indexKy].kysymys = action.data.kysymys
        return syväKopioR
      case 'LISÄÄ_KYSYMYS':
        let uusiKysymys =  {kysymys: strings.newQ, vastaukset: [], kysymys_id: action.data.kysymys_id}
        syväKopioR[tenttiValinta].kysely.push(uusiKysymys)
        return syväKopioR
      case 'POISTA_KYSYMYS':
        syväKopioR[tenttiValinta].kysely.splice(action.data.indexKy, 1)
        return syväKopioR
      case 'MUOKKAA_TENTTI':
        syväKopioR[tenttiValinta].nimi = action.data.nimi
        return syväKopioR
      case 'LISÄÄ_TENTTI':
        let uusiTentti = {tentti_id: action.data.tentti_id, nimi: strings.newE, kysely: []}
        syväKopioR.push(uusiTentti)
        return syväKopioR
      case 'POISTA_TENTTI':
        if(state.length > 1){
          syväKopioR.splice(tenttiValinta, 1)
        }
        return syväKopioR
      case 'PÄIVITÄ_TENTIN_ALOITUSAIKA':
        syväKopioR[tenttiValinta].tentin_aloitusaika = action.data.päiväjaaika
        return syväKopioR;
      case 'PÄIVITÄ_TENTIN_LOPETUSAIKA':
        syväKopioR[tenttiValinta].tentin_lopetusaika = action.data.päiväjaaika
        return syväKopioR;
      default:
        throw new Error();
    }
  }

  
//--------Kirjautumisen, roolin ja käyttäjän tietojen hallinnointia

  // Tarkistaa onko kirjauduttu
  const kirjauduttu = (onkoKirjauduttu) => {
    setKirjauduttuSisään(onkoKirjauduttu)
    setNäkymä(1)
  }

  //Asetetaan talteen käyttäjän token
  const asetaToken = (token) => {
    setKäyttäjänToken(token)
  }

  //Poistutaan kirjautumisnäkymään, tyhjätään token
  const poistu = () => {
    if (window.confirm(strings.exit)){
      setKirjauduttuSisään(false)
      setKäyttäjänToken(null)
      setNäkymä(4)
    }
  }

  //Tarkistetaan, onko käyttäjä admin
  const käyttäjäOnAdmin = async () => {
    let onkoAdmin = false;
    if (käyttäjänToken != null && kirjauduttu){
      tarkistaKäyttäjänRooli(käyttäjänToken).then((result) =>{
        onkoAdmin = result
        return onkoAdmin;
      }).catch((error) => {
        console.log(error)
      })
    }
    return onkoAdmin;
  }

  //Vaihdetaan teksti kielen mukaan
  const vaihdaKieli = (kieli) => {
    strings.setLanguage(kieli);
    console.log(kieli)
    
  }










//------------------------------------------MUOTOILUA

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


  return (
    <div>
      {/*Yläpalkki navigointipainikkeineen*/}
      <div className={classes1.root}>
        <AppBar position="static">
          <Toolbar>
            {kirjauduttuSisään ?
            <div>
            <Button color="inherit" 
              edge="start" className={classes1.menuButton} 
              onClick={() => setNäkymä(1)}>{strings.exams}</Button>

            <Button color="inherit" 
              onClick={() => setNäkymä(5)}>{strings.user}</Button>


            {käyttäjäOnAdmin() ?
            <Button color="inherit" 
              onClick={() => setNäkymä(2)}> {strings.editExams} </Button>
             : null }

            <Button 
              onClick={() => setNäkymä(7)}>{strings.dropdemo}</Button>
            
            {käyttäjäOnAdmin() ?
              <Button 
                onClick={() => setNäkymä(3)}> {strings.chartdemo}</Button>
            : null }

            <Button color="inherit" 
              onClick={() => poistu()}>{strings.signof}</Button>
            </div>


            : <div>
              <Button color="inherit" edge="start" 
                onClick={() => setNäkymä(4)}>{strings.login}</Button>

              <Button color="inherit" edge="start" 
              onClick={() => setNäkymä(6)}>{strings.register}</Button>

            <Button color="inherit" 
              onClick={() => (vaihdaKieli('fi'), setKieli('fi'))}><img className="kieliPainike" src={finland} alt="Finland" /></Button>

            <Button color="inherit" 
              onClick={() => (vaihdaKieli('en'), setKieli('en'))}><img className="kieliPainike" src={unitedkingdom} alt="Finland" /></Button>
            </div>}
          </Toolbar>
      </AppBar>
      </div>
      <br></br>

      <div>
        {/*Painikkeet kyselyn valintaa varten*/}
        {näkymä === 1 || näkymä === 2 ? 
          <div>{state.map((arvo, index) => 
            <BootstrapButton 
              key={"kyselypainike" + index} 
              variant="contained" 
              color="primary" 
              role="button"
              disableRipple className={classesButton.margin} 
              onClick={() => (setTenttiValinta(index),  setPalautettu(false))}>{arvo.nimi}
            </BootstrapButton>)}

            
        <br/><br/>
        
        {/*Tarkistetaan, ettei state ole undefined*/}
        {/*{state[tenttiValinta] != undefined ? */}
        {näkymä === 1 ? <div> {/*Näkymän mukaan tulostetaan*/}
          <Fade right><TulostaKysymykset
            dispatch={dispatch}
            kysymys={state[tenttiValinta]} 
            palautettu= {palautettu}
            asetaPalautettu= {setPalautettu}
            token = {käyttäjänToken}/>
          </Fade>
          <br/>
          </div> : null}

        {näkymä === 2 && käyttäjäOnAdmin() ?
          <Fade right><MuokkaaKysymyksiä 
            dispatch={dispatch}
            asetaTentti={setTenttiValinta}
            tentti={state[tenttiValinta]}
            token = {käyttäjänToken}/>
            </Fade> : null}
            </div> 
            
            : null}
          
        {näkymä === 3 ?
        <div>
          <Fade right>
            {/*<Kaavio/>*/}
            <KaavioVaaka/>
            <br></br>
          </Fade>
        </div> : null}

        {näkymä === 4 ?
          <Login kirjautuminen = {kirjauduttu} asetaToken = {asetaToken}/> : null
        }

        {näkymä === 5 ?
          <Käyttäjä käyttäjänToken = {käyttäjänToken}/> : null}

        {näkymä === 6 ?
          <LuoKäyttäjä/> : null}


        {näkymä === 7 ?
          <div>Demo  <Dropzone/></div> : null}
        <br></br>
        </div>
      </div>
  );
}

export default App;
