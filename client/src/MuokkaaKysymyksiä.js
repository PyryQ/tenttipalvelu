import React from 'react';
//Material-ui -komponentteja
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Input } from '@material-ui/core';
import Button from '@material-ui/core/Button';

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
          <label><Checkbox className="vastausCheckM" key={"muuta_ov" + itemV.vastaus_id} checked={itemV.oikea} 
            onChange={(e) => props.dispatch({type: 'MUUTA_OIKEA_VASTAUS', data:{valittuV: e.target.checked, indexKy: indexK, indexVa: indexV}})}/>
          </label>
          
          {/*Input vastauksen asettamiselle*/}
          <Input className="vastausM" defaultValue={itemV.vastaus} key={"muuta_v" + itemV.vastaus_id}
            onChange = {(e) => props.dispatch({type: 'MUUTA_VASTAUSTA', data:{valittuV: e.target.value, indexKy: indexK, indexVa: indexV}})}>
          </Input>

          {/*Button vastauksen poistamiselle*/}
          <Button className="vastausPoisto" key={"poista_v" + itemV.vastaus_id}
            onClick={() => props.dispatch({type: 'POISTA_VASTAUS', data:{indexKy: indexK, indexVa: indexV}})}>
          <DeleteIcon/></Button>
        </div>)}

        {/*Button vastauksen lisäämiselle*/}
        <Button className="lisääM" key={"lisää_v" + itemK.vastaus_id}
          onClick={() => props.dispatch({type: 'LISÄÄ_VASTAUS', data:{indexKy: indexK}})}>
        <AddCircleOutlineIcon/></Button>
      </div>
    }
    catch{alert("Vastausvaihtoehtojen tulostus epäonnistui")}
  }
  
  return (
    <div>
      {/*Input tentin nimen muokkaamiseksi*/}
      <Input key={"tentti_input" + dataM.tentti_id} className="kysymysM" defaultValue={dataM.nimi} 
        onChange={(e) => props.dispatch({type: 'MUOKKAA_TENTTI', data:{tentinNimi: e.target.value}})}>
      </Input>
      <br></br>
      {/*Button tentin poistamiseksi*/}
      <Button className="poistaTT" 
        onClick={() => props.dispatch({type: 'POISTA_TENTTI', data:{}})}>
        <DeleteIcon/>Poista {dataM.nimi}</Button>

      {/*Button tentin lisäämiseksi*/}
      <Button className="lisääUT" 
        onClick={() => props.dispatch({type: 'LISÄÄ_TENTTI', data:{}})}>
        <AddCircleOutlineIcon/>Lisää uusi tentti</Button>

      {/*Tulostetaan kysymys, sen poistobutton ja vastausvaihtoehdot*/}
      {dataM.kysely.map((item, indexK) => 
        <Card className="korttiM" elevation={3} key={"kortti" + item.kysymys_id}>
          <div>
            <Input className="kysymysM" 
              defaultValue={item.kysymys}
              onChange={(e) => props.dispatch({type: 'MUOKKAA_KYSYMYSTÄ', data:{valittuK: e.target.value, indexKy: indexK}})}>
            </Input> 

            <Button className="poistoM" onClick={() => props.dispatch({type: 'POISTA_KYSYMYS', data:{indexKy: indexK}})}>
              <DeleteIcon/></Button>
            
            {näytäVaihtoehdot(item, indexK)}
          </div>
        </Card>)}
      <div>
        {/*Button kysymyksen lisäämiseksi*/}
        <Button className="lisääK" key={"lisää_k"}
          onClick={() => props.dispatch({type: 'LISÄÄ_KYSYMYS', data:{}})}>
          <AddCircleOutlineIcon/>{"Lisää kysymys"}
        </Button>
      </div>
    </div>
  )
}