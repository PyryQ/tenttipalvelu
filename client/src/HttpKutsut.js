import axios from 'axios';

var path = "";
switch (process.env.NODE_ENV) {
  case 'production' : 
    path = 'https://tenttipalvelu.herokuapp.com/'
    break;
  case 'development' : 
    path = 'http://localhost:4000/'
    break;
  case 'test' : 
    path = 'http://localhost:4000/'
    break;
  default :
    throw "Ympäristöä ei ole alustettu"
}
console.log(path)

//-------------------------------------PUT------------------------

export async function päivitäTenttiNimi(tentti_id, nimi, token) {
    try{
      let result = await axios.put(path + "paivitys/paivitatenttiteksti", {tentti_id: tentti_id, nimi: nimi, token: token})
      return result;
    }
    catch(exception){
      console.log("Tenttiä ei onnistuttu päivittämään.")
    }
  }

export async function päivitäTentinAloitusaika(päiväjaaika, tentti_id, token) {
  try{
    let result = await axios.put(path + "paivitys/paivitatenttialoitusaika", {päiväjaaika: päiväjaaika, tentti_id: tentti_id, token: token})
    return result;
  }
  catch(exception){
    console.log("Tenttiä ei onnistuttu päivittämään.")
  }
}

export async function päivitäTentinLopetusaika(päiväjaaika, tentti_id, token) {
  try{
    let result = await axios.put(path + "paivitys/paivitatenttilopetusaika", {päiväjaaika: päiväjaaika, tentti_id: tentti_id, token: token})
    return result;
  }
  catch(exception){
    console.log("Tenttiä ei onnistuttu päivittämään.")
  }
}

export async function päivitäKysymysNimi(kysymys_id, kysymys, token) {
    try{
      let result = await axios.put(path + "paivitys/paivitakysymysteksti", {kysymys_id: kysymys_id, kysymys: kysymys, token: token})
      return result;
    }
    catch(exception){
      console.log("Kysymystä ei onnistuttu päivittämään.")
    }
  }

export async function päivitäVastausNimi(vastaus_id, vastaus, token) {
  try{
    let result = await axios.put(path + "paivitys/paivitavastausteksti", {vastaus_id: vastaus_id, vastaus: vastaus, token: token})
    return result;
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu päivittämään.")
  }
}

export async function lisääKäyttäjänVastaus(vastaus_id, vastaus, oikea_vastaus, token) {
  try{
    let result = await axios.post(path + "lisays/lisaakayttajanvastaus/" + vastaus_id + "/" + vastaus + "/" + oikea_vastaus + "/" + token)
    return result;
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu päivittämään.")
  }
}

export async function päivitäOikeaVastaus(vastaus_id, onkoOikein, token) {
  try{
    let result = await axios.put(path + "paivitaoikeavastaus", {vastaus_id: vastaus_id, oikein: onkoOikein, token: token})
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu päivittämään.")
  }
}

//-----------------------------------DELETE--------------------------------

export async function poistaTentti(tentti_id, token) {
    try{
      let result = await axios.delete(path + "poista/poistatentti", {data: {tentti_id: tentti_id, token: token}})
      return result
    }
    catch(exception){
      console.log("Tenttiä ei onnistuttu poistamaan.")
    }
  }

export async function poistaKysymys(kysymys_id, token) {
  try{
    let result = await axios.delete(path + "poista/poistakysymys", {data: {kysymys_id: kysymys_id, token: token}})
    return result
  }
  catch(exception){
    console.log("Kysymystä ei onnistuttu poistamaan.")
  }
}

export async function poistaVastaus(vastaus_id, token) {
  try{
    let result = await axios.delete(path + "poista/poistavastaus", {data: {vastaus_id: vastaus_id, token: token}})
    return result
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu poistamaan.")
  }
}

//------------------------------POST-------------------------

export async function lisääTentti(token) {
  try{
    let result = await axios.post(path + "lisays/lisaatentti/" + token)
    return(result.data)
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu lisäämään.")
  }
}

export async function lisääKysymys(tentti_id, token) {
  try{
    let result = await axios.post(path + "lisays/lisaakysymys/" + tentti_id + "/" + token)
    return(result.data)
  }
  catch(exception){
    console.log("Kysymystä ei onnistuttu lisäämään.")
  }
}

export async function lisääVastaus(kysymys_id, token) {
  try{
    let result = await axios.post(path + "lisays/lisaavastaus/" + kysymys_id + "/" +  token)
    return(result.data)
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu lisäämään.")
  }
}

export async function lisääKäyttäjänKysymyksenTulos(kysymys_id, tulos, token) {
  try{
    let result = await axios.post(path + "lisays/lisaakysymystulos/" + kysymys_id + "/" + tulos + "/" + token)
    return(result.data)
  }
  catch(exception){
    console.log("Vastausta ei onnistuttu lisäämään.")
  }
}

export async function tarkistaKäyttäjänSalasana(käyttäjänSähköposti, käyttäjänSalasana) {
  try{
    let result = await axios.post("http://localhost:4000/tarkistasalasana", {sahkoposti: käyttäjänSähköposti, salasana: käyttäjänSalasana})
    return(result.data)
  }
  catch(exception){
    console.log("Salasanaa ei onnistuttu tarkistamaan.")
  }
}

export async function lisääKäyttäjä(käyttäjänTiedot) {
  try{
    let result = await axios.post("http://localhost:4000/lisaakayttaja", käyttäjänTiedot)
    return(result.data)
  }
  catch(exception){
    console.log("Käyttäjää ei onnistuttu lisäämään.")
  }
}

//------------------------------------GET---------------------------------

export async function haeKäyttäjänTiedot(sähköposti) {
  try{
    let result = await axios.get(path + "kayttajantiedot/" + sähköposti)
    return(result.data[0])
  }
  catch(exception){
    console.log("Käyttäjän tietoja ei saatu.")
  }
}

export async function haeKäyttäjät() {
  try{
    let result = await axios.get(path + "kayttajat")
    return(result.data)
  }
  catch(exception){
    console.log("Käyttäjien tietoja ei saatu.")
  }
}

export async function tarkistaKäyttäjänRooli(käyttäjänToken) {
  try{
    let result = await axios.get(path + "tarkistarooli/" + käyttäjänToken)
    let onkoAdmin = result.data
    return(onkoAdmin)
  }
  catch(exception){
    console.log("Roolia ei saatu tarkistettua.")
  }
}

export async function käyttäjänTiedotTokenista(käyttäjänToken) {
  try{
    let result = await axios.get(path + "tarkistarooli/" + käyttäjänToken)
    let käyttäjänTiedot = result.data
    return(käyttäjänTiedot)
  }
  catch(exception){
    console.log("Käyttäjän tokenin tarkistus ei onnistunut.")
  }
}

// export async function haeVastausId(kysymys_id) {
//   try{
//     let result = await axios.post(path + "lisaavastaus/", {kysymys_id: kysymys_id})
//     console.log(result.data)
//     return(result.data)
//   }
//   catch(exception){
//     console.log("Vastausta ei onnistuttu lisäämään.")
//   }
// }