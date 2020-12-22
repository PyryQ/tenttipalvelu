import axios from 'axios';



export async function päivitäTenttiNimi(tentti_id, nimi, token) {
    try{
      let result = await axios.put("http://localhost:4000/paivitys/paivitatenttiteksti", {tentti_id: tentti_id, nimi: nimi, token: token})
      return result;
    }
    catch(exception){
      console.log("Kysymystä ei onnistuttu päivittämään.")
    }
  }

export async function päivitäTentinAloitusaika(päiväjaaika, tentti_id, token) {
  try{
    let result = await axios.put("http://localhost:4000/paivitys/paivitatenttialoitusaika", {päiväjaaika: päiväjaaika, tentti_id: tentti_id, token: token})
    return result;
  }
  catch(exception){
    console.log("Kysymystä ei onnistuttu päivittämään.")
  }
}

export async function päivitäTentinLopetusaika(päiväjaaika, tentti_id, token) {
  try{
    let result = await axios.put("http://localhost:4000/paivitys/paivitatenttilopetusaika", {päiväjaaika: päiväjaaika, tentti_id: tentti_id, token: token})
    return result;
  }
  catch(exception){
    console.log("Kysymystä ei onnistuttu päivittämään.")
  }
}

export async function päivitäKysymysNimi(kysymys_id, kysymys, token) {
    try{
      let result = await axios.put("http://localhost:4000/paivitys/paivitakysymysteksti", {kysymys_id: kysymys_id, kysymys: kysymys, token: token})
      return result;
    }
    catch(exception){
      console.log("Kysymystä ei onnistuttu päivittämään.")
    }
  }

export async function päivitäVastausNimi(vastaus_id, vastaus, token) {
  try{
    let result = await axios.put("http://localhost:4000/paivitys/paivitavastausteksti", {vastaus_id: vastaus_id, vastaus: vastaus, token: token})
    return result;
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu päivittämään.")
  }
}

export async function lisääKäyttäjänVastaus(vastaus_id, vastaus, token) {
  try{
    let result = await axios.post("http://localhost:4000/lisays/lisaakayttajanvastaus/" + vastaus_id + "/" + vastaus + "/" + token)
    return result;
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu päivittämään.")
  }
}

export async function päivitäOikeaVastaus(vastaus_id, onkoOikein, token) {
  try{
    let result = await axios.put("http://localhost:4000/paivitaoikeavastaus", {vastaus_id: vastaus_id, oikein: onkoOikein, token: token})
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu päivittämään.")
  }
}



//-----------------------------------DELETE--------------------------------

export async function poistaTentti(tentti_id, token) {
  console.log(token)
    try{
      let result = await axios.delete("http://localhost:4000/poista/poistatentti", {data: {tentti_id: tentti_id, token: token}})
      return result
    }
    catch(exception){
      console.log("Vastausta ei onnistuttu poistamaan.")
    }
  }

export async function poistaKysymys(kysymys_id, token) {
  try{
    let result = await axios.delete("http://localhost:4000/poista/poistakysymys", {data: {kysymys_id: kysymys_id, token: token}})
    return result
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu poistamaan.")
  }
}

export async function poistaVastaus(vastaus_id, token) {
  try{
    let result = await axios.delete("http://localhost:4000/poista/poistavastaus", {data: {vastaus_id: vastaus_id, token: token}})
    return result
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu poistamaan.")
  }
}

//------------------------------POST-------------------------


export async function lisääTentti(token) {
  try{
    let result = await axios.post("http://localhost:4000/lisays/lisaatentti/" + token)
    return(result.data)
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu lisäämään.")
  }
}

export async function lisääKysymys(tentti_id, token) {
  try{
    let result = await axios.post("http://localhost:4000/lisays/lisaakysymys/" + tentti_id + "/" + token)
    return(result.data)
  }
  catch(exception){
    console.log("Kysymystä ei onnistuttu lisäämään.")
  }
}

export async function lisääVastaus(kysymys_id, token) {
  try{
    let result = await axios.post("http://localhost:4000/lisays/lisaavastaus/" + kysymys_id + "/" +  token)
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