import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

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
  if (dataT.kysely == null){
    dataT.kysely = [];
  }
  let palautettu = props.palautettu;

  const vastaustenTarkistus = (index) =>{
    try{
      let tarkistus = dataT.kysely[index].vastaukset
      console.log(tarkistus.length)
      if (tarkistus.length !== 0){
      for (var i = 0; i < tarkistus.length; i++){
        if (tarkistus[i].oikea_vastaus !== tarkistus[i].valittu){
          return (<CloseIcon/>);
        }
      }
      return (<CheckIcon/>);
    }
  }
    catch{
      alert("Vastausten tarkistus epäonnistui")
      return null
    }
  }

  const päivitäKäyttäjänVastaus = (vastaus, indexV) =>{
    try{
      //käyttäjäid, vastaus

  }
    catch{
      alert("Vastausten tarkistus epäonnistui")
      return null
    }
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
            onChange={(e) => (päivitäKäyttäjänVastaus(), props.dispatch({type: 'VASTAUS_VALITTU', data:{valittuV:e.target.checked, indexKy: indexK, indexVa: indexV}}))}/>
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
      {dataT.kysely.map((item, index) => 
      <Card key={"kortti" + item.kysymys_id} 
        className="kortti" 
        elevation={3}>
        <div className="kysymys">
          {item.kysymys}
          {palautettu ? vastaustenTarkistus(index) : null}
          </div> {näytäVaihtoehdot(index)}
      </Card>)}
    </div>) : null
  );
}