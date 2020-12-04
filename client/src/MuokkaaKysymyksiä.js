import React from 'react';
//Material-ui -komponentteja
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Input } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import {paivitaTenttiNimi, paivitaKysymysNimi, paivitaVastausNimi, poistaVastaus, 
  poistaKysymys, lisääKysymys, lisääVastaus, lisääTentti, poistaTentti, paivitaOikeaVastaus} from './HttpKutsut';
// Kehitettävää: 
//aktiivisen tentin buttonille eri väri

//Muokkausnäkymä, jossa mahdollista muokata, 
//lisätä tai poistaa vastauksia, kysymyksiä ja tenttejä
export default function MuokkaaKysymyksiä(props) {

  //Alustetaan dataM kysymyksen mukaan
  let dataM = props.kysymys;

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
            onChange = {(e) => (paivitaVastausNimi(itemV.vastaus_id, e.target.value), props.dispatch({type: 'MUUTA_VASTAUSTA', data:{vastaus: e.target.value, indexKy: indexK, indexVa: indexV}}))}>
          </Input>

          {/*Button vastauksen poistamiselle*/}
          <Button className="vastausPoisto" key={"poista_v" + itemV.vastaus_id}
            onClick={() => (poistaVastaus(itemV.vastaus_id), props.dispatch({type: 'POISTA_VASTAUS', data:{indexKy: indexK, indexVa: indexV}}))}>
          <DeleteIcon/></Button>
        </div>)}

        {/*Button vastauksen lisäämiselle*/}
        
        <Button className="lisääM" onClick={() => 
          (lisääVastaus(itemK.kysymys_id), 
          props.dispatch({type: 'LISÄÄ_VASTAUS', data:{indexKy: indexK, kysymys_id: itemK.kysymys_id}}))} key={"lisää_v" + itemK.vastaus_id}>
        <AddCircleOutlineIcon/></Button>
      </div>
    }
    catch{alert("Vastausvaihtoehtojen tulostus epäonnistui")}
  }
  
  return (
    <div>
      {/*Input tentin nimen muokkaamiseksi*/}
      <Input key={"tentti_input" + dataM.tentti_id} className="kysymysM" defaultValue={dataM.nimi} 
        onChange={(e) => (props.dispatch({type: 'MUOKKAA_TENTTI', data:{nimi: e.target.value}}),paivitaTenttiNimi(dataM.tentti_id, e.target.value))}>
      </Input>
      <br></br>

      {/*Button tentin poistamiseksi*/}
      <Button className="poistaTT" 
        onClick={() => (props.dispatch({type: 'POISTA_TENTTI', data:{}}), poistaTentti(dataM.tentti_id))}>
        <DeleteIcon/>Poista {dataM.nimi}</Button>

      {/*Button tentin lisäämiseksi*/}
      <Button className="lisääUT" 
        onClick={() => (props.dispatch({type: 'LISÄÄ_TENTTI', data:{}}), lisääTentti())}>
        <AddCircleOutlineIcon/>Lisää uusi tentti</Button>

      {/*Tulostetaan kysymys, sen poistobutton ja vastausvaihtoehdot*/}
      {dataM.kysely.map((itemK, indexK) => 
        <Card className="korttiM" elevation={3} key={"kortti" + itemK.kysymys_id}>
          <div>
            <Input className="kysymysM" 
              defaultValue={itemK.kysymys}
              onChange={(e) => (props.dispatch({type: 'MUOKKAA_KYSYMYSTÄ', data:{kysymys: e.target.value, indexKy: indexK}}), paivitaKysymysNimi(itemK.kysymys_id, e.target.value))}>
            </Input> 

            <Button className="poistoM" onClick={() => (props.dispatch({type: 'POISTA_KYSYMYS', data:{indexKy: indexK}}), poistaKysymys(itemK.kysymys_id))}>
              <DeleteIcon/></Button>
            
            {näytäVaihtoehdot(itemK, indexK)}
          </div>
        </Card>)}
      <div>
        {/*Button kysymyksen lisäämiseksi*/}
        <Button className="lisääK" key={"lisää_k"}
          onClick={() => (props.dispatch({type: 'LISÄÄ_KYSYMYS', data:{tentti_id: dataM.tentti_id}}), lisääKysymys(dataM.tentti_id))}>
          <AddCircleOutlineIcon/>{"Lisää kysymys"}
        </Button>
      </div>
    </div>
  )
}