let listaOrdinazioni = [];
let listaFornitori = [];
let listaEmail = [];

function log(testo){
      document.getElementById('log').innerHTML = "<b>"+testo+"</b>";
}

function salva(id){
      localStorage.setItem(id,document.getElementById(id).value);
}

function checkUrl(url) {
      var request = new XMLHttpRequest();
      request.open('GET', 'http://www.mozilla.org', true);
      request.onreadystatechange = function () {
            if (request.readyState === 4) {
                  if (request.status === 404) {
                        return 1;
                  }
            }
      };
      request.send();
      return 0;
}

function estraiIdScheda(url) {
      let indiceInizio = url.search("/d/");
      let indiceFine = url.search("/edit?");
      if (indiceInizio == null || indiceFine == null)
            return -1;

      let risultato = url.substr(indiceInizio, indiceFine)
            .replace("/d/", "")
            .replace(url.substr(indiceFine, url.length - 1), "");
      return risultato;
}

function scremaOrdinazioni() {
      const risultato = listaOrdinazioni.filter(function (ordine){
            let giorno = ordine.Data.substring(5,ordine.Data.length-1).split(",");
            let stringagiorno = giorno[2]+"/"+(Number(giorno[1])+1)+"/"+giorno[0];
            if (stringagiorno==document.getElementById("data").value){
                  for (let i=0; i<listaFornitori.length; i++){
                        if (listaFornitori[i].Prodotti.toUpperCase().search(ordine.Prodotto.toUpperCase())>=0)
                              return true;
                  }
            }
            return false;
      });
      listaOrdinazioni = [].concat(risultato);
}

function aggiungiRichiesta(mail, richiesta){
      let indice = listaEmail.findIndex(obj => obj.mail==mail);
      if (indice===-1){
            listaEmail.push({mail: mail, testo: richiesta});
      } else {
            listaEmail[indice].testo += ", "+richiesta;
      }
}
