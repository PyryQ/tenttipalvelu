import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';



const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const vertaa = (previousProps, nextProps) =>{
      console.log(previousProps)
    let a = previousProps.itemV == nextProps.itemV
     return a
  }


export default function Kysymys(props) { //Kysymyksen index
    let indexK = props.indexK
    let itemV = props.itemV
    let indexV = props.indexV
    let palautettu = props.palautettu

    //Mikäli tuloksia ei ole palautettu, tulostetaan vain yksi checkbox
    if (palautettu === false){
      return <label>
        <Checkbox className="kysymys" key={itemV.uid}
          id={indexV} checked={itemV.valittu} 
          onChange={(e) => props.dispatch({type: 'VASTAUS_VALITTU', data:{valittuV:e.target.checked, indexKy: indexK, indexVa: indexV}})}/>
        {itemV.vastaus}</label>
    }

    //Mikäli vastaukset on palautettu, tulostetaan myös vastaukset GreenCheckBoxin avulla
    return <label>
      <Checkbox disabled key={itemV + "" + indexV} checked={itemV.valittu}
        id={indexV} onChange={(e) => props.muutaVastaus(e, indexK, indexV)}/>

        <GreenCheckbox disabled className="vastaukset" checked={itemV.oikea}/>
        {itemV.vastaus}</label>
}


  