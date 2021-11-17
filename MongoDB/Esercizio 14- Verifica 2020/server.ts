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
dispatcher.addListener("POST", "/api/servizio1", function (req, res) {
    let dataStart = new Date(req["BODY"].dataStart);
    let dataEnd=new Date(req["BODY"].dataEnd);
    mongoClient.connect(CONNECTIONSTRING, function (err, client) {
        if (!err) {
          let db = client.db(DBNAME);
          let collection = db.collection("vallauri");
          let rq = collection.find({"$and":[{"dob":{"$gte":dataStart}},{"dob":{"$lte":dataEnd}}]}).project({"nome":1,"classe":1}).toArray();
          rq.then(function (data) {
            res.writeHead(200, HEADERS.json);
            res.write(JSON.stringify(data));
            res.end();
          });
          rq.catch(function (err) {
            res.writeHead(200, HEADERS.text);
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
