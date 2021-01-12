import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import {lisääKäyttäjänVastaus, lisääKäyttäjänKysymyksenTulos} from './HttpKutsut'

import strings from './Localization';

//Luodaan GreenCheckBox oikeita vastauksia varten
const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);


export default function TulostaKysymykset(props) {
  let token = props.token
  //Alustetaan kysymysten tulostusta varten dataT
  let dataT = props.kysymys
  //Tarkistetaan, ettei appia käynnistettäessä kartoiteta tyhjää listaa
  if (dataT.kysely === null || dataT.kysely === undefined){
    dataT.kysely = [];
  }
  let palautettu = props.palautettu;



  const vastaustenTarkistus = (kysymys_id, indexK) =>{

    console.log("kysymys id " + kysymys_id)
    try{
      let tarkistus = dataT.kysely[indexK].vastaukset
      if (tarkistus.length !== 0){
        for (var i = 0; i < tarkistus.length; i++){
          if (tarkistus[i].oikea_vastaus !== tarkistus[i].valittu){

            lisääKäyttäjänKysymyksenTulos(kysymys_id, false, token)
            return (<CloseIcon/>);
          }
        }
        lisääKäyttäjänKysymyksenTulos(kysymys_id, true, token)
        return (<CheckIcon/>);
      } 
    }
    catch{
      alert("Vastausten tarkistus epäonnistui")
      return null
    }
  }

  const lisääTämäKäyttäjänVastaus = (vastaus, vastaus_id, indexK, indexV) =>{

      lisääKäyttäjänVastaus(vastaus_id, vastaus, token).then((result) => {
        if (result != false){
          props.dispatch({type: 'VASTAUS_VALITTU', data:{valittuV: vastaus, indexKy: indexK, indexVa: indexV}})
        }
      }).catch((error) => {
        console.log(error)
      })
  }

  //Tulostetaan vaihtoehdot sen mukaan, onko vastaukset palautettu
  const näytäVaihtoehdot = (indexK) => { //Kysymyksen index
    //Tarkistetaan, ettei appia käynnistettäessä kartoiteta tyhjää listaa
    if (dataT.kysely[indexK].vastaukset == null){
      dataT.kysely[indexK].vastaukset = [];
    }
    //Mikäli tuloksia ei ole palautettu, tulostetaan vain yksi checkbox
    if (palautettu === false){
      return dataT.kysely[indexK].vastaukset.map((itemV, indexV) => 
      <div key={"eipalautettu" + itemV.vastaus_id}>
        <label>
          <Checkbox disabled={palautettu === true} 
            className="kysymys" 
            key={"checkbox" +  itemV.vastaus_id} 
            checked={itemV.valittu} 
            onChange={(e) => (lisääTämäKäyttäjänVastaus(e.target.checked, itemV.vastaus_id, indexK, indexV))}/>
          {itemV.vastaus} 
        </label>

      </div>)
    }

    //Mikäli vastaukset on palautettu, tulostetaan myös vastaukset GreenCheckBoxin avulla
    return dataT.kysely[indexK].vastaukset.map((itemV, indexV) => 
      <div key={"palautettu" + itemV.vastaus_id}>
        
        <label>
          <Checkbox disabled 
            key={"checkboxd" +  itemV.vastaus_id} 
            checked={itemV.valittu}/>

          <GreenCheckbox disabled 
            className="vastaukset" 
            checked={itemV.oikea_vastaus}/>

          {itemV.vastaus}
        </label>
      </div>)
  }

  return (dataT.kysely !== undefined ? (
  <div className="tulostusosio">
      {dataT.kysely.map((itemK, indexK) => 
      <Card key={"kortti" + itemK.kysymys_id} 
        className="kortti" 
        elevation={3}>
        <div className="kysymys">
          {itemK.kysymys}
          {palautettu ? vastaustenTarkistus(itemK.kysymys_id, indexK) : null}
          </div> {näytäVaihtoehdot(indexK)}
      </Card>)}

      <Button color="primary" variant="contained" disabled={palautettu}
        onClick={() => {
          if (window.confirm("Palautetaanko " + dataT.nimi)){
            props.asetaPalautettu(true);
          }}}> 
        {strings.returnAnswers}
      </Button>
    </div>) : null
  );
}