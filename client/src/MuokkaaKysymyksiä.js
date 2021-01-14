import React from 'react';

//Material-ui -komponentteja
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Input, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import strings from './Localization.js'

import {päivitäTenttiNimi, päivitäKysymysNimi, päivitäVastausNimi, poistaVastaus, 
  poistaKysymys, lisääKysymys, lisääVastaus, lisääTentti, poistaTentti, päivitäOikeaVastaus, päivitäTentinAloitusaika, päivitäTentinLopetusaika} from './HttpKutsut';
// Kehitettävää: 
//aktiivisen tentin buttonille eri väri

//Muokkausnäkymä, jossa mahdollista muokata, 
//lisätä tai poistaa vastauksia, kysymyksiä ja tenttejä


export default function MuokkaaKysymyksiä(props) {

  let token = props.token


  //---------------------------LISÄÄ

  //Lisää uusi tentti
  async function lisääUusiTentti() {
    lisääTentti(token).then((result) => {
      if (result !== false){
        let tentti_id = result
        props.dispatch({type: 'LISÄÄ_TENTTI', data:{tentti_id: tentti_id}})
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  //Lisää uusi kysymys
  async function lisääUusiKysymys(tentti_id) {
    lisääKysymys(tentti_id, token).then((result) => {
      if (result !== false){
        let kysymys_id = result
        props.dispatch({type: 'LISÄÄ_KYSYMYS', data:{kysymys_id: kysymys_id}})
      }
      }).catch((error) => {
      console.log(error)
    })
  }

  //Lisää uusi vastaus
  async function lisääUusiVastaus(indexK, kysymys_id) {
    lisääVastaus(kysymys_id, token).then((result) => {
      if (result !== false){
        let vastaus_id = result
        props.dispatch({type: 'LISÄÄ_VASTAUS', data:{indexKy: indexK, kysymys_id: kysymys_id, vastaus_id: vastaus_id}})
      }
    }).catch((error) => {
      console.log(error)
    })
  }

//-------------------------PÄIVITÄ

async function päivitäTämäTenttiNimi(vastaus_id, teksti) {

  päivitäTenttiNimi(vastaus_id, teksti, token).then((result) => {
    if (result !== false){
      props.dispatch({type: 'MUOKKAA_TENTTI', data:{nimi: teksti}})
    }
  }).catch((error) => {
    console.log(error)
  })
}

async function päivitäTämäKysymysNimi(kysymys_id, teksti, indexK) {

  päivitäKysymysNimi(kysymys_id, teksti, token).then((result) => {
    if (result !== false){
      props.dispatch({type: 'MUOKKAA_KYSYMYSTÄ', data:{kysymys: teksti, indexKy: indexK}})
    }
  }).catch((error) => {
    console.log(error)
  })
}

async function päivitäTämäVastausNimi(vastaus_id, teksti, indexK, indexV) {

  päivitäVastausNimi(vastaus_id, teksti, token).then((result) => {
    if (result !== false){
      props.dispatch({type: 'MUOKKAA_VASTAUSTA', data:{vastaus: teksti, indexKy: indexK, indexVa: indexV}})
    }
  }).catch((error) => {
    console.log(error)
  })
}


  async function päivitäTämäOikeaVastaus(vastaus_id, valittu, indexK, indexV) {

    päivitäOikeaVastaus(vastaus_id, valittu, token).then((result) => {
      if (result !== false){
        props.dispatch({type: 'MUUTA_OIKEA_VASTAUS', data:{valittuV: valittu, indexKy: indexK, indexVa: indexV}})
      }
    }).catch((error) => {
      console.log(error)
    })
  }


  async function muutaAloitusaika(päiväjaaika, tentti_id) {

    päivitäTentinAloitusaika(päiväjaaika, tentti_id, token).then((result) => {
      if (result !== false){
        let uusiAika = result.data
        uusiAika = asetaAika(uusiAika)
        props.dispatch({type: 'PÄIVITÄ_TENTIN_ALOITUSAIKA', data:{päiväjaaika: uusiAika}})
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  async function muutaLopetusaika(päiväjaaika, tentti_id) {

    päivitäTentinLopetusaika(päiväjaaika, tentti_id, token).then((result) => {
      if (result !== false){
        let uusiAika = result.data
        uusiAika = asetaAika(uusiAika)
        props.dispatch({type: 'PÄIVITÄ_TENTIN_LOPETUSAIKA', data:{päiväjaaika: uusiAika}})
      }
    }).catch((error) => {
      console.log(error)
    })
  }



  //---------------------POISTA

  async function poistaTämäTentti() {
    console.log("muokkaakysymyksiä" + token)
    poistaTentti(dataM.tentti_id, token).then((result) => {
      if (result !== false){
        props.asetaTentti(0)
        props.dispatch({type: 'POISTA_TENTTI', data:{}});
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  async function poistaTämäKysymys(kysymys_id, indexK) {

    poistaKysymys(kysymys_id, token).then((result) => {
      if (result !== false){
        props.dispatch({type: 'POISTA_KYSYMYS', data:{indexKy: indexK}});
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  async function poistaTämäVastaus(vastaus_id, indexK, indexV) {

    poistaVastaus(vastaus_id, token).then((result) => {
      if (result !== false){
        props.dispatch({type: 'POISTA_VASTAUS', data:{indexKy: indexK, indexVa: indexV}});
      }
    }).catch((error) => {
      console.log(error)
    })
  }



  let dataM = props.tentti; //Alustetaan dataM kysymyksen mukaan

  function asetaAika(aika) {
    if (aika !== null){
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
          <label><Checkbox className="vastausCheckM" 
            key={"muuta_ov" + itemV.vastaus_id} 
            checked={itemV.oikea_vastaus} 
            onChange={(e) => päivitäTämäOikeaVastaus(itemV.vastaus_id, e.target.checked, indexK, indexV)}/>
          </label>
          
          {/*Input vastauksen asettamiselle*/}
          <Input className="vastausM" 
            defaultValue={itemV.vastaus} 
            key={"muuta_v" + itemV.vastaus_id}
            onBlur = {(e) => päivitäTämäVastausNimi(itemV.vastaus_id, e.target.value, indexK, indexV)}>
          </Input>

          {/*Button vastauksen poistamiselle*/}
          <Button className="vastausPoisto" 
            key={"poista_v" + itemV.vastaus_id}
            onClick={() => poistaTämäVastaus(itemV.vastaus_id, indexK, indexV)}>
            <DeleteIcon/></Button>
        </div>)}

        {/*Button vastauksen lisäämiselle*/}
        
        <Button className="lisääM" 
          key={"lisää_v" + itemK.vastaus_id}
          onClick={() => lisääUusiVastaus(indexK, itemK.kysymys_id, token)}>
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
        onChange={(e) => päivitäTämäTenttiNimi(dataM.tentti_id, e.target.value)}>
      </Input>
      <br></br>

      
      {/*Button tentin poistamiseksi*/}
      <Button className="poistaTT" 
        onClick={() => {
          if (window.confirm(strings.delete + " " + dataM.nimi + "?")){
            poistaTämäTentti();
          }
        }}>
        <DeleteIcon/>{strings.delete} {dataM.nimi}</Button>

      {/*Button tentin lisäämiseksi*/}
      <Button className="lisääUT" onClick={() => lisääUusiTentti()}>
        <AddCircleOutlineIcon/>{strings.addE}</Button>

        <form className={classes.container} noValidate>
        <TextField
          key={"aloitusaika" + dataM.tentti_id}
          id="datetime-local"
          label={strings.startingTime}
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
          label={strings.endingTime}
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
        <Card className="korttiM" l={2} elevation={3} key={"kortti" + itemK.kysymys_id}>
          <div>
            <Input className="kysymysM" 
              defaultValue={itemK.kysymys}
              onBlur={(e) => päivitäTämäKysymysNimi(itemK.kysymys_id, e.target.value, indexK)}>
            </Input> 

            <Button className="poistoM" onClick={() => poistaTämäKysymys(itemK.kysymys_id, indexK)}>
              <DeleteIcon/></Button>
            
            {näytäVaihtoehdot(itemK, indexK)}
          </div>
        </Card>)}
      <div>
        {/*Button kysymyksen lisäämiseksi*/}
        <Button className="lisääK" key={"lisää_k"}
          onClick={() => lisääUusiKysymys(dataM.tentti_id)}>
          <AddCircleOutlineIcon/>{strings.addQ}
        </Button>
      </div>
    </div>
  )
}