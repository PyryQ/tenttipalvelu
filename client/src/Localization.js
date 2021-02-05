import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
  en: {
    //First pages
    login: "Login",
    register: "Register",
    email: "Email",
    firstname: "First name",
    lastname: "Last name",
    password: "Password",
    passwordAgain: "Password again",
    rolePassword: "Role password",
    admin: "Admin",
    role: "Role",


    //Navigation buttons
    exams: "Exams",
    user: "User",
    users: "Users",
    signof: "Sign off",
    editExams: "Edit exams",
    chartdemo: "Chart demo",
    dropdemo: "Dropzone demo",

    //Changes to exams
    addQ: "Add question",
    delete: "Delete",
    deleteE: "Delete exam",
    addE: "Add new Exam",

    //Additions to database
    newE: "New exam",
    newQ: "New question",
    newA: "New answer",

    //Time
    startingTime: "Starting time",
    endingTime: "Ending time",

    //Delete user
    deleteSelectedUser: "Delete delected user",
    deleteMyUser: "Delete my user",
    deleteQue: "Delete the selected user?",


    //Alerts
    LoginSuccessful: "Login successful.",
    LoginFailed: "Login failed.",
    unmatchPassword: "Passwords don't match.",
    invalidEmail: "Invalid email.",
    somethingWrong: "Something went wrong.",
    incorrectRolePW: "Incorrect password for the role.",
    userSuccesful: "User created succesfully.",
    unfilledForm: "Some section is missing.",
    exit: "Do you want to sign out?",
    passwordNotice: "The password must have at least: \n - six characters \n - one number \n - one lowercase letter \n - one uppercase letter.",

    //Admin password guide
    adminPasswordQuide: "Password for user's role. If you are a student, write: oppilas",

    returnAnswers: "Return answers"
  },

  //------------------------------FI-----------------------------
  fi: {
    login: "Kirjaudu",
    register: "Luo käyttäjä",
    email: "Sähköposti",
    firstname: "Etunimi",
    lastname: "Sukunimi",
    password: "Salasana",
    passwordAgain: "Salasana uudelleen",
    rolePassword: "Roolisalasana",
    admin: "Admin",
    role: "Rooli",

    //Navikointipainikkeet
    exams: "Tentit",
    user: "Käyttäjä",
    users: "Käyttäjät",
    signof: "Kirjaudu ulos",
    editExams: "Muokkaa tenttejä",
    chartdemo: "Kaaviodemo",
    dropdemo: "Dropzonedemo",

    //Muokkaus
    addQ: "Lisää kysymys",
    delete: "Poista",
    deleteE: "Poista tentti",
    addE: "Lisää uusi tentti",

    //Tietokantalisäykset
    newE: "Uusi tentti",
    newQ: "Uusi kysymys",
    newA: "Uusi vastaus",

    //Aika
    startingTime: "Aloitusaika",
    endingTime: "Lopetusaika",

    //Poista käyttäjä
    deleteSelectedUser: "Poista valittu käyttäjä",
    deleteMyUser: "Poista käyttäjä",
    deleteQue: "Poistetaanko valittu käyttäjä?",


    //Ilmoitukset ja varoitukset
    LoginSuccessful: "Kirjautuminen onnistui.",
    LoginFailed: "Kirjautuminen ei onnistunut.",
    unmatchPassword: "Salasanat eivät täsmää.",
    somethingWrong: "Jokin meni pieleen.",
    userSuccesful: "Käyttäjän luonti onnistui.",
    incorrectRolePW: "Väärä käyttäjäsalasana.",
    unfilledForm: "Jokin kohta puuttuu.",
    invalidEmail: "Sähköposti ei käy.",
    exit: "Poistutaanko ohjelmasta?",
    passwordNotice: "Salasanassa tulee olla vähintään: \n - kuusi merkkiä \n - yksi numero \n - yksi pieni kirjain \n - yksi iso kirjain.",

    //Admin password guide
    adminPasswordQuide: "Salasana käyttäjän roolille. Jos olet oppilas, kirjoita: oppilas",


    returnAnswers: "Palauta vastaukset"
  }
});

export default strings;

