import {useEffect, useState } from 'react';
import { DataGrid, RowsProp, ColDef } from '@material-ui/data-grid';

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

  useEffect(()=>{
    // const haeKäyttäjänData = async () => {
    //   let käyttäjätHaku = await axios.get("http://localhost:4000/kayttajat")
    //   console.log(käyttäjätHaku.data)
    //   setKäyttäjät(käyttäjätHaku.data)
    //   console.log(käyttäjät)
    // }


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



  //console.log(käyttäjänTiedot)
  //let käyttäjä = await axios.get("http://localhost:4000/kayttajantiedot/" + k_sähköposti)
  if (käyttäjät !== null && käyttäjät !== undefined){
    return <div style={{ height: 800, width: '100%' }}>
        <DataGrid rows={käyttäjät} columns={sarakkeet} pageSize={15}/>
    </div>
          
  } else return null
}



{/* <Card>
        {käyttäjät.map((item, index) => 
          <div>
              {item.etunimi}

            </div>)}
            </Card> */}