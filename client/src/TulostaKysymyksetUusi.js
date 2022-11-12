import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {useEffect} from 'react';



//TÄMÄ TIEDOSTO ON LUOTU KOPIOKSI

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

export default function TulostaKysymykset1(props) {

  //Alustetaan data
  let vainKysymys = props.vainKysymys;
  console.log(props.vainKysymys)
  
  //Valitaan datasta oikea_vastaus kysely käsiteltäväksi

  let palautettu = props.palautettu;

  const vastaustenTarkistus = (kysymys) =>{
    
    let pituus = kysymys.vastaukset.length
    let tarkistus = kysymys.vastaukset
    console.log(tarkistus)
    for (var i = 0; i < pituus; i++){
      if (tarkistus[i].oikea_vastaus !== tarkistus[i].valittu){
        return (<CloseIcon/>);
      }
    }
    return (<CheckIcon/>);
  }


  //Tulostetaan vaihtoehdot sen mukaan, onko vastaukset palautettu
  const näytäVaihtoehdot = (kysymys, kysymysIndex) => {
    
    //Mikäli tuloksia ei ole palautettu, tulostetaan vain yksi checkbox
    if (palautettu === false){
      return kysymys.vastaukset.map((alkio, vastausIndex) => 
      <div key={vastausIndex}>
        <label><Checkbox disabled={palautettu === true} className="kysymys" key={alkio}
        id={vastausIndex} checked={alkio.valittu} onChange={(e) => props.muutaVastaus(e, kysymysIndex, vastausIndex)}/>
        {alkio.vastaus}</label>

      </div>)
    }

    //Mikäli vastaukset on palautettu, tulostetaan myös vastaukset GreenCheckBoxin avulla
    return kysymys.vastaukset.map((alkio, vastausIndex) => 
      <div key={vastausIndex}>
        <label><Checkbox disabled key={alkio + "" + vastausIndex} checked={alkio.valittu}
        id={vastausIndex} onChange={(e) => props.muutaVastaus(e, kysymysIndex, vastausIndex)}/>

        <GreenCheckbox disabled className="vastaukset" checked={alkio.oikea_vastaus}/>
        {alkio.vastaus}</label>
      </div>)
  }

  return (<div>
      {vainKysymys.map((item, index) => <Card className="kortti" elevation={3}><div className="kysymys">
      {item.kysymys}{props.palautettu ? vastaustenTarkistus(item) : null}</div> {näytäVaihtoehdot(item, index)}
      </Card>)}
    </div>
  );
}