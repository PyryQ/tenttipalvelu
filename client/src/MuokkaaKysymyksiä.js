import React from 'react';
//Material-ui -komponentteja
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Input } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {paivitaTenttiNimi, paivitaKysymysNimi, paivitaVastausNimi, poistaVastaus, 
  poistaKysymys, lisääKysymys, lisääVastaus, lisääTentti, poistaTentti, paivitaOikeaVastaus, päivitäTentinAloitusaika, päivitäTentinLopetusaika} from './HttpKutsut';
// Kehitettävää: 
//aktiivisen tentin buttonille eri väri

//Muokkausnäkymä, jossa mahdollista muokata, 
//lisätä tai poistaa vastauksia, kysymyksiä ja tenttejä


export default function MuokkaaKysymyksiä(props) {

  let token = props.token

  //Päivitetään tietokanta ja asetetaan vastauksen id staten päivittämistä varten
  async function lisääUusiTentti() {
    lisääTentti(token).then((result) => {
      if (result != false){
        let tentti_id = result
        props.dispatch({type: 'LISÄÄ_TENTTI', data:{tentti_id: tentti_id}})
      }
    }).catch((error) => {
      console.log(error)
    })
}

//Päivitetään tietokanta ja asetetaan vastauksen id staten päivittämistä varten
async function lisääUusiKysymys(tentti_id, token) {
  lisääKysymys(tentti_id, token).then((result) => {
    if (result != false){
      let kysymys_id = result
      props.dispatch({type: 'LISÄÄ_KYSYMYS', data:{kysymys_id: kysymys_id}})
    }
    }).catch((error) => {
    console.log(error)
  })
}

  //Päivitetään tietokanta ja asetetaan vastauksen id staten päivittämistä varten
  async function lisääUusiVastaus(indexK, kysymys_id) {
    lisääVastaus(kysymys_id, token).then((result) => {
      if (result != false){
        let vastaus_id = result
        props.dispatch({type: 'LISÄÄ_VASTAUS', data:{indexKy: indexK, kysymys_id: kysymys_id, vastaus_id: vastaus_id}})
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  async function muutaAloitusaika(päiväjaaika, tentti_id) {

    päivitäTentinAloitusaika(päiväjaaika, tentti_id).then((result) => {
      let uusiAika = result.data
      uusiAika = asetaAika(uusiAika)
      console.log(uusiAika)
      props.dispatch({type: 'PÄIVITÄ_TENTIN_ALOITUSAIKA', data:{päiväjaaika: uusiAika}})
    
    }).catch((error) => {
      console.log(error)
    })
  }

  async function muutaLopetusaika(päiväjaaika, tentti_id) {

    päivitäTentinLopetusaika(päiväjaaika, tentti_id).then((result) => {
      let uusiAika = result.data
      uusiAika = asetaAika(uusiAika)
      console.log(uusiAika)
      props.dispatch({type: 'PÄIVITÄ_TENTIN_LOPETUSAIKA', data:{päiväjaaika: uusiAika}})
    
    }).catch((error) => {
      console.log(error)
    })
  }




  let dataM = props.tentti; //Alustetaan dataM kysymyksen mukaan

  function asetaAika(aika) {
    if (aika != null){
      aika = aika.replace(/\.\d+/, "");
      aika = aika.replace('Z', "");
      return aika;
    }
  }

  //Tulostetaan vaihtoehdot kysymyksen mukaan
  const näytäVaihtoehdot = (itemK, indexK) => {
    //Mikäli tuloksia ei ole palautettu, tulostetaan vain yksi checkbox
    try {
      return <div> {itemK.vastaukset.map((itemV, indexV) => 
        <div key={"vastaukset" + itemV.vastaus_id}>
          {/*Checkbox oikean vastauksen asettamiselle*/}
          <label><Checkbox className="vastausCheckM" key={"muuta_ov" + itemV.vastaus_id} checked={itemV.oikea_vastaus} 
            onChange={(e) => (props.dispatch({type: 'MUUTA_OIKEA_VASTAUS', data:{valittuV: e.target.checked, indexKy: indexK, indexVa: indexV}}, paivitaOikeaVastaus(itemV.vastaus_id, e.target.checked)))}/>
          </label>
          
          {/*Input vastauksen asettamiselle*/}
          <Input className="vastausM" defaultValue={itemV.vastaus} key={"muuta_v" + itemV.vastaus_id}
            onBlur = {(e) => (paivitaVastausNimi(itemV.vastaus_id, e.target.value), 
              props.dispatch({type: 'MUOKKAA_VASTAUSTA', data:{vastaus: e.target.value, indexKy: indexK, indexVa: indexV}}))}>
          </Input>

          {/*Button vastauksen poistamiselle*/}
          <Button className="vastausPoisto" key={"poista_v" + itemV.vastaus_id}
            onClick={() => (poistaVastaus(itemV.vastaus_id), props.dispatch({type: 'POISTA_VASTAUS', data:{indexKy: indexK, indexVa: indexV}}))}>
          <DeleteIcon/></Button>
        </div>)}

        {/*Button vastauksen lisäämiselle*/}
        
        <Button className="lisääM" onClick={() => lisääUusiVastaus(indexK, itemK.kysymys_id)} 
          key={"lisää_v" + itemK.vastaus_id}>
        <AddCircleOutlineIcon/></Button>
      </div>
    }
    catch{alert("Vastausvaihtoehtojen tulostus epäonnistui")}
  }


  //Date and timen muotoilua
  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

  const classes = useStyles();




  
  return (
    <div>

      {/*Input tentin nimen muokkaamiseksi*/}
      <Input key={"tentti_input" + dataM.tentti_id} className="kysymysM" defaultValue={dataM.nimi} 
        onBlur={(e) => (paivitaTenttiNimi(dataM.tentti_id, e.target.value), 
        props.dispatch({type: 'MUOKKAA_TENTTI', data:{nimi: e.target.value}}))}>
      </Input>
      <br></br>

      
      {/*Button tentin poistamiseksi*/}
      <Button className="poistaTT" 
        onClick={() => {
          if (window.confirm("Poistetaanko " + dataM.nimi)){
            poistaTentti(dataM.tentti_id);
            props.dispatch({type: 'POISTA_TENTTI', data:{}});
          }
        }}>
        <DeleteIcon/>Poista {dataM.nimi}</Button>

      {/*Button tentin lisäämiseksi*/}
      <Button className="lisääUT" onClick={() => lisääUusiTentti()}>
        <AddCircleOutlineIcon/>Lisää uusi tentti</Button>

        <form className={classes.container} noValidate>
        <TextField
          key={"aloitusaika" + dataM.tentti_id}
          id="datetime-local"
          label="Tentin aloitusaika"
          type="datetime-local"
          defaultValue={asetaAika(dataM.tentin_aloitusaika)}
          className={classes.textField}
          onBlur={(e) => muutaAloitusaika(e.target.value, dataM.tentti_id)}
          InputLabelProps={{
          shrink: true,
        }}/>
        <TextField
          key={"lopetusaika" + dataM.tentti_id}
          id="datetime-local"
          label="Tentin lopetusaika"
          type="datetime-local"
          defaultValue ={asetaAika(dataM.tentin_lopetusaika)}
          className={classes.textField}
          onBlur={(e) => muutaLopetusaika(e.target.value, dataM.tentti_id)}
          InputLabelProps={{
          shrink: true,
        }}/>
      </form>

      <br></br>

      {/*Tulostetaan kysymys, sen poistobutton ja vastausvaihtoehdot*/}
      {dataM.kysely.map((itemK, indexK) => 
        <Card className="korttiM" elevation={3} key={"kortti" + itemK.kysymys_id}>
          <div>
            <Input className="kysymysM" 
              defaultValue={itemK.kysymys}
              onBlur={(e) => (props.dispatch({type: 'MUOKKAA_KYSYMYSTÄ', data:{kysymys: e.target.value, indexKy: indexK}}), paivitaKysymysNimi(itemK.kysymys_id, e.target.value))}>
            </Input> 

            <Button className="poistoM" onClick={() => (props.dispatch({type: 'POISTA_KYSYMYS', data:{indexKy: indexK}}), poistaKysymys(itemK.kysymys_id))}>
              <DeleteIcon/></Button>
            
            {näytäVaihtoehdot(itemK, indexK)}
          </div>
        </Card>)}
      <div>
        {/*Button kysymyksen lisäämiseksi*/}
        <Button className="lisääK" key={"lisää_k"}
          onClick={() => lisääUusiKysymys(dataM.tentti_id)}>
          <AddCircleOutlineIcon/>{"Lisää kysymys"}
        </Button>
      </div>
    </div>
  )
}