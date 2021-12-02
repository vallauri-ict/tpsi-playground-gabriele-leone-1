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
dispatcher.addListener("GET", "/api/servizio1", function (req, res) {
    mongoClient.connect(CONNECTIONSTRING, function (err, client) {
        if (!err) {
          let db = client.db(DBNAME);
          let collection = db.collection("facts");
          //sulla find c'è sostanzialmente sempre il nome del campo tranne con la and e la or invece nell'aggregate è ilk contratio 
          let rq = collection.find().project({"_id":1,"value":1}).toArray();
          rq.then(function (data) {
            res.writeHead(200, HEADERS.json);
            res.write(JSON.stringify(data));
            res.end();
          });
          rq.catch(function (err) {
            res.writeHead(500, HEADERS.text);
            res.write("Errore esecuzione query: " + err.message);
            res.end();
          });
          rq.finally(function () {
            client.close();
          });
        } else {
          console.log("errore nella connessione al databasse :" + err.message);
        }
      });

    
})


dispatcher.addListener("POST", "/api/servizio2", function (req, res) {
  let value=req["BODY"].value
        let id=req["BODY"].id
  mongoClient.connect(CONNECTIONSTRING, function (err, client) {
      if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("facts");
        //sulla find c'è sostanzialmente sempre il nome del campo tranne con la and e la or invece nell'aggregate è ilk contratio 
        let rq = collection.aggregate([
          {$match:{
            "_id":id
          }},
          {
            $set:{
              "value": value
            }
          }

        ]).toArray();
        rq.then(function (data) {
          res.writeHead(200, HEADERS.json);
          res.write(JSON.stringify(data));
          res.end();
        });
        rq.catch(function (err) {
          res.writeHead(500, HEADERS.text);
          res.write("Errore esecuzione query: " + err.message);
          res.end();
        });
        rq.finally(function () {
          client.close();
        });
      } else {
        console.log("errore nella connessione al databasse :" + err.message);
      }
    });

  
})