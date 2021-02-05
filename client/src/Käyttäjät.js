import { useEffect, useState } from 'react';
import { DataGrid, RowsProp, ColDef } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { haeKäyttäjät, poistaKäyttäjäId } from './HttpKutsut';
import strings from './Localization.js'

export default function Käyttäjä(props) {

  const [käyttäjät, setKäyttäjät] = useState(null)
  const sarakkeet = [
    { field: 'etunimi', headerName: strings.firstname, width: 150 },
    { field: 'sukunimi', headerName: strings.lastname, width: 150 },
    { field: 'sähköposti', headerName: strings.email, width: 150 },
    { field: 'rooli', headerName: strings.role, width: 150 }
  ];
  const rivit = käyttäjät

  const [poistettavaKäyttäjä, setPoistettavaKäyttäjä] = useState(null)

  //Haetaan kaikkien käyttäjien data, kun välilehti avataan
  useEffect(() => {
    async function haeKaikkiKäyttäjät() {
      haeKäyttäjät().then((result) => {
        if (result !== false) {
          setKäyttäjät(result)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    haeKaikkiKäyttäjät()
  }, [])

  function tallennaValinta(selections) {
    console.log(selections.rowIds[0])
    setPoistettavaKäyttäjä(selections.rowIds)
  }

  async function poistaTämäKäyttäjä(käyttäjänID, käyttäjänToken) {

    poistaKäyttäjäId(käyttäjänID, käyttäjänToken).then((result) => {

      if (result === true) {
        alert("Käyttäjän poisto onnistui")
      }
      else {
        console.log("käyttäjän poisto epäonnistui")
      }

    })
  }

  //Jos käyttäjien data saatu, muodostetaan datagrid
  if (käyttäjät !== null && käyttäjät !== undefined) {
    return <div><div style={{ height: 800, width: '100%' }}>
      <DataGrid
        rows={käyttäjät}
        columns={sarakkeet}
        pageSize={15}
        onSelectionChange={tallennaValinta} />
      <br />
    </div>
      <Button className="poistakayttaja"
        key={"poistakayttaja"}
        onClick={() => poistaTämäKäyttäjä(poistettavaKäyttäjä, props.käyttäjänToken)}>
        Poista valittu käyttäjä
        </Button>
    </div>
  } else return null
}
