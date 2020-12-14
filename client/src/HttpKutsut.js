import axios from 'axios';


export async function paivitaTenttiNimi(tentti_id, nimi) {
    try{
      let result = await axios.put("http://localhost:4000/paivitatenttiteksti/" + tentti_id +"/"+ nimi)
    }
    catch(exception){
      console.log("Kysymystä ei onnistuttu päivittämään.")
    }
  }

export async function päivitäTentinAloitusaika(päiväjaaika, tentti_id) {
  try{
    let result = await axios.put("http://localhost:4000/paivitatenttialoitusaika", {päiväjaaika: päiväjaaika, tentti_id: tentti_id})
    return result;
  }
  catch(exception){
    console.log("Kysymystä ei onnistuttu päivittämään.")
  }
}

export async function päivitäTentinLopetusaika(päiväjaaika, tentti_id) {
  try{
    let result = await axios.put("http://localhost:4000/paivitatenttilopetusaika", {päiväjaaika: päiväjaaika, tentti_id: tentti_id})
    return result;
  }
  catch(exception){
    console.log("Kysymystä ei onnistuttu päivittämään.")
  }
}

export async function paivitaKysymysNimi(kysymys_id, kysymys) {
    console.log(kysymys_id) 
    try{
      let result = await axios.put("http://localhost:4000/paivitakysymysteksti/" + kysymys_id +"/" + kysymys)
    }
    catch(exception){
      console.log("Kysymystä ei onnistuttu päivittämään.")
    }
  }

export async function paivitaVastausNimi(vastaus_id, vastaus) {
    try{
      let result = await axios.put("http://localhost:4000/paivitavastausteksti/" + vastaus_id + "/" + vastaus)
    }
    catch(exception){
      console.log("Vastausta ei onnistuttu päivittämään.")
    }
  }

export async function paivitaOikeaVastaus(vastaus_id, onkoOikein) {
    try{
      let result = await axios.put("http://localhost:4000/paivitaoikeavastaus", {vastaus_id: vastaus_id, oikein: onkoOikein})
    }
    catch(exception){
      console.log("Vastausta ei onnistuttu päivittämään.")
    }
  }



//-----------------------------------DELETE--------------------------------

export async function poistaTentti(tentti_id) {
    try{
      let result = await axios.delete("http://localhost:4000/poistatentti/" + tentti_id)
    }
    catch(exception){
      console.log("Vastausta ei onnistuttu poistamaan.")
    }
  }

export async function poistaKysymys(kysymys_id) {
  try{
    let result = await axios.delete("http://localhost:4000/poistakysymys/" + kysymys_id)
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu poistamaan.")
  }
}

export async function poistaVastaus(vastaus_id) {
  try{
    let result = await axios.delete("http://localhost:4000/poistavastaus/" + vastaus_id)
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu poistamaan.")
  }
}

//------------------------------POST-------------------------


export async function lisääTentti() {
  try{
    let result = await axios.post("http://localhost:4000/lisaatentti")
    return(result.data)
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu lisäämään.")
  }
}

export async function lisääKysymys(tentti_id) {
  try{
    let result = await axios.post("http://localhost:4000/lisaakysymys/" + tentti_id)
    return(result.data)
  }
  catch(exception){
    console.log("Kysymystä ei onnistuttu lisäämään.")
  }
}

export async function lisääVastaus(kysymys_id) {
  try{
    let result = await axios.post("http://localhost:4000/lisaavastaus", {kysymys_id: kysymys_id})
    return(result.data)
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu lisäämään.")
  }
}



//------------------------------------GET---------------------------------



// export async function haeVastausId(kysymys_id) {
//   try{
//     let result = await axios.post("http://localhost:4000/lisaavastaus/", {kysymys_id: kysymys_id})
//     console.log(result.data)
//     return(result.data)
//   }
//   catch(exception){
//     console.log("Vastausta ei onnistuttu lisäämään.")
//   }
// }

export async function haeKäyttäjänTiedot(sähköposti) {
  try{
    let result = await axios.get("http://localhost:4000/kayttajantiedot/" + sähköposti)
    console.log(result.data)
    return(result.data[0])
  }
  catch(exception){
    console.log("Käyttäjän tietoja ei saatu.")
  }
}


export async function tarkistaKäyttäjänRooli(käyttäjänToken) {
  try{
    let result = await axios.get("http://localhost:4000/tarkistarooli/" + käyttäjänToken)
    let onkoAdmin = result.data
    return(onkoAdmin)
  }
  catch(exception){
    console.log("Roolia ei saatu tarkistettua.")
  }
    
}