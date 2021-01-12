// ES6 module syntax
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
 en:{
   //First pages
   login:"Login",
   register:"Register",
   email:"Email",
   firstname:"First name",
   lastname:"Last name",
   password:"Password",
   passwordAgain:"Password again",
   rolePassword:"Rolepassword",
   admin: "Admin",
   role: "Role",

   //Navigation buttons
   exams:"Exams",
   user:"User",
   signof:"Sign off",
   editExams:"Edit exams",
   demo: "Demos",

   //Muokkaus
   addQ: "Add question",


  returnAnswers:"Return answers"
 },
 fi: {
   login:"Kirjaudu",
   register:"Luo käyttäjä",
   email:"Sähköposti",
   firstname:"Etunimi",
   lastname:"Sukunimi",
   password:"Salasana",
   passwordAgain:"Password again",
   rolePassword:"Rolepassword",
   admin: "Admin",
   role: "Rooli",

  //Navigation buttons
  exams:"Tentit",
  user:"Käyttäjä",
  signof:"Kirjaudu ulos",
  editExams:"Muokkaa tenttejä",
  demo: "Demot",

  //Muokkaus
  addQ: "Lisää kysymys",
   
   
  returnAnswers:"Palauta vastaukset"
 }
});

export default strings;

