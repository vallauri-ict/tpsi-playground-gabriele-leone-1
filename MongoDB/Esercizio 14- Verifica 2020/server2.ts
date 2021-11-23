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

// registrazione dei servizi
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("vallauri");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.aggregate([
      { $match: { genere: "f", classe: "4A" } },
      { $set: { informatica: { $concatArrays: ["$informatica", [7]] } } },
    ]).toArray();
    rq.then(function (data) {
      console.log("Query 2 con promise: ", data);
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

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("vallauri");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.deleteMany({ "classe": "3B", "sistemi": { "$in": [3] } });
    rq.then(function (data) {
      console.log("Query 4 con promise: ", data);
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



mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("vallauri");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.aggregate(
      [
        {$group:{
          _id:"$classe",
          totaleAssClass:{$sum:"$assenze"}
        }},
        {
          $sort:
          {
            totaleAssClass:-1
          }
        }
      ]
    ).toArray();
    rq.then(function (data) {
      console.log("Query 5 con promise: ", data);
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
