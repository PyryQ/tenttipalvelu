import axios from 'axios'; //serverin käyttöä varten


export async function paivitaTenttiNimi(tentti_id, nimi) {
    console.log("päivitykseen tullaan, tentti_id:" + tentti_id + "kysymys:" + nimi) 
    try{
      let result = await axios.put("http://localhost:4000/paivitatenttiteksti/" + tentti_id +"/"+ nimi)
    }
    catch(exception){
      console.log("Kysymystä ei onnistuttu päivittämään.")
    }
  }
export async function paivitaKysymysNimi(kysymys_id, kysymys) {
    console.log(kysymys_id) 
    try{
      let result = await axios.put("http://localhost:4000/paivitakysymysteksti", {kysymys_id: kysymys_id, kysymys: kysymys})
    }
    catch(exception){
      console.log("Kysymystä ei onnistuttu päivittämään.")
    }
  }

export async function paivitaVastausNimi(vastaus_id, vastaus) {
    try{
      let result = await axios.put("http://localhost:4000/paivitavastausteksti", {v_id: vastaus_id, v: vastaus})
    }
    catch(exception){
      console.log("Vastausta ei onnistuttu päivittämään.")
    }
  }

  export async function poistaVastaus(vastaus_id) {
    try{
      let result = await axios.delete("http://localhost:4000/poistavastaus", {v_id: vastaus_id})
    }
    catch(exception){
      console.log("Vastausta ei onnistuttu poistamaan.")
    }
  }

  export async function poistaKysymys(kysymys_id) {
    try{
      let result = await axios.delete("http://localhost:4000/poistakysymys",{k_id: kysymys_id})
    }
    catch(exception){
      console.log("Vastausta ei onnistuttu poistamaan.")
    }
  }