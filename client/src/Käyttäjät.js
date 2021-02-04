import {useEffect, useState } from 'react';
import { DataGrid, RowsProp, ColDef } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import {haeKäyttäjät} from './HttpKutsut';
import strings from './Localization.js'

export default function Käyttäjä(props) {

  const [käyttäjät, setKäyttäjät] =useState(null)
  const sarakkeet = [
      { field: 'etunimi', headerName: strings.firstname, width: 150 },
      { field: 'sukunimi', headerName: strings.lastname, width: 150 },
      { field: 'sähköposti', headerName: strings.email, width: 150 },
      { field: 'rooli', headerName: strings.role, width: 150 }
  ];
  const rivit = käyttäjät

  const [poistettavaKäyttäjä, setPoistettavaKäyttäjä] = useState(null)

  //Haetaan kaikkien käyttäjien data, kun välilehti avataan
  useEffect(()=>{
    async function haeKaikkiKäyttäjät() {
        haeKäyttäjät().then((result) => {
          if (result !== false){
            setKäyttäjät(result)
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    haeKaikkiKäyttäjät()
  },[])

  function tallennaValinta(selections) {
    console.log(selections.rowIds)
    setPoistettavaKäyttäjä(selections.rowIds)
  }

  // tarkistaKäyttäjänSalasana(käyttäjänSähköposti, käyttäjänSalasana).then((result) => {
  //   //Mikäli token on validi, tallennetaan token ja merkitään kirjautuminen onnistuneeksi
  //     if (result != "" && result != undefined && result != null) {
  //       alert(strings.LoginSuccessful)
  //       props.asetaToken(result)
  //       props.kirjautuminen(true)
  //     }
  //     else {
  //       alert(strings.LoginFailed)
  //     }
  // })

  //Jos käyttäjien data saatu, muodostetaan datagrid
  if (käyttäjät !== null && käyttäjät !== undefined){
    return <div style={{ height: 800, width: '100%' }}>
        <DataGrid 
          rows={käyttäjät} 
          columns={sarakkeet} 
          pageSize={15}
          onSelectionChange={tallennaValinta}/>
          <br/>
        <Button className="poistakayttaja" key={"poistakayttaja"}>
          Poista valittu käyttäjä
        </Button>
    </div>

          
  } else return null
}
