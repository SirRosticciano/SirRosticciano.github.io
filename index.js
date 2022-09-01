
//inizializza il bottone drive
var linkDrive = localStorage.getItem("drive");
document.getElementById('drive').value = linkDrive;

var email = localStorage.getItem('email');
document.getElementById('email').value = email;

var pwd = localStorage.getItem('pwd');
document.getElementById('pwd').value = pwd;

//inizializza il bottone data
var oggi = new Date();
var dataCorrente = oggi.getDate()+'/'+(oggi.getMonth()+1)+'/'+oggi.getFullYear();
document.getElementById('data').value = dataCorrente;




function urlChange(){
      //localStorage.setItem('drivelink',document.getElementById('drive').value);
      salva('drive');
      let sheetid = estraiIdScheda(linkDrive);
      
      //inizializza la lista delle ordinazioni
      let parser = new PublicGoogleSheetsParser(sheetid, "Ordinazioni");
      parser.parse().then((items) => {
            listaOrdinazioni=[].concat(items);
      });

      //inizializza la lista dei fornitori
      parser = new PublicGoogleSheetsParser(sheetid, "Fornitori");
      parser.parse().then((items) => {
            listaFornitori=[].concat(items);
      });

      scremaOrdinazioni();

      if (listaOrdinazioni.length>0){
            log(listaOrdinazioni.length+" ordinazioni in questa data.")
      } else {
            log("Nessuna ordinazione in questa data.");
      }

      listaEmail = [];
      generaEmail();
      document.getElementById('invia').disabled = (listaEmail.length==0);
}



function generaEmail(){
      listaOrdinazioni.forEach(ordine => {
            for (let i=0; i<listaFornitori.length; i++){
                  if (listaFornitori[i].Prodotti.toUpperCase().search(ordine.Prodotto.toUpperCase())>=0){
                        aggiungiRichiesta(listaFornitori[i].Mail, ordine.Prodotto+" "+ordine.Quantità);
                  }
            }
      });
      listaEmail.forEach(m => m.testo+=".");
}



function inviaEmail(){
      if (listaEmail.length==0){
            log('Non ci sono mail da inviare. <br> Prova a scaricare il file, a cambiare data o a controllare che gli ordini siano stati inseriti correttamente.')
      } else {
            listaEmail.forEach(elemento => {
                  Email.send({
                        Host : "smtp.elasticemail.com",
                        Username : email,
                        Password : pwd,
                        To : elemento.mail,
                        From : "sir.rosticciano@gmail.com",
                        Subject : "Gelateria Galatea",
                        Body : "Buonasera,  / vorremmo ordinaare i seguenti articoli: "+ elemento.testo+"/ Grazie in anticipo."
                  }).then(
                      message => alert(message)
                  );
            });
            log(listaEmail.length+" email sono state inviate.");
      }
}
