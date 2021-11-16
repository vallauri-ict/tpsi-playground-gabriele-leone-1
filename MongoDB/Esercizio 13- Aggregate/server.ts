import * as _http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
const port: number = 1337;

const dispatcher: Dispatcher = new Dispatcher();
const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5b";
// tutte le volte che arriva una richgiesta dal client parte questa funzione
const server = _http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
});

server.listen(port);
console.log("Server in ascolto sulla porta " + port);

//usiamo promise

//QUERY 1- Si vogliono selezionare i record che hanno status A, raggrupparli secondo il campo cust_id e,
//per ogni gruppo, eseguire la somma del campo amount (importo unitario)
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    //aggregate si aspetta un vettore enumerativo
    //nel match posso utilizzare i filtri di find
    //_id è una parola fissa che indica il campo su cui vogliamo fare i gruppi
    //nell'id devo mettere il $ davanti al nome del campo
    //per ogni gruppo devo creare un campo che in questo caso è "totale"
    //nel "totale" dobbiamo mettere il nome del campo di cui vogliamo eseguire l'operazione e deve essere sempre preceduto dal dollaro
    //a sinistra dei due punti no dollaro, a destra si
    //dopo $group il record set risultante avrà solo due colonne che sono quelle selezionate nel group
    let rq = collection
      .aggregate([
        { $match: { status: "A" } },
        { $group: { _id: "$cust_id", totale: { $sum: "$amount" } } },
        { $sort: { totale: -1 } },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 1: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 2- Utilizzo della funzione di aggregazione $avg sull ex prec
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    let rq = collection
      .aggregate([
        {
          $group: {
            _id: "$cust_id",
            avgAmount: { $avg: "$amount" },
            avgTotal: { $avg: { $multiply: ["$qta", "$amount"] } },
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 2: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 3- Conteggio degli unicorni maschi e degli unicorni femmina
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $match: { gender: { $exists: true } } },
        { $group: { _id: "$gender", totale: { $sum: 1 } } },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 3: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 4-Calcolare il numero medio di vampiri uccisi dagli unicorni femmina e dagli unicorni maschi
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $match: { gender: { $exists: true } } },
        {
          $group: {
            _id: { gender: "$gender" },
            mediaVampiri: { $avg: "$vampires" },
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 4: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 5- : raggruppare gli unicorni per genere e tipo di pelo
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $match: { gender: { $exists: true } } },
        {
          $group: {
            _id: { gender: "$gender", hair: "$hair" },
            nEsemplari: { $sum: 1 },
          },
        },
        { $sort: { nEsemplari: -1, _id: -1 } },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 5: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 6- numero medio di vampiri uccisi dagli unicorni complessivamente presenti nella collezione
