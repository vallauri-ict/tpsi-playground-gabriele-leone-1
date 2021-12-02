import * as http from "http";
import express from "express";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";
import * as bodyParser from "body-parser";
import * as fs from "fs";
let port: number = 1337;

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING =
  "mongodb+srv://admin:admin@cluster0.f9c5j.mongodb.net/5B?retryWrites=true&w=majority"; //mongodb://127.0.0.1:27017
const DBNAME = "5B";
let app = express();

let server = http.createServer(app);

server.listen(port, function () {
  console.log("Server in ascolto sulla porta " + port);
  init();
});

let paginaErrore = "";
function init() {
  fs.readFile("./static/error.html", function (err, data) {
    if (!err) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = "<h1> Risorsa non Trovata </h1>";
    }
  });
}
//**************************************************************************
// ELENCO DELLE ROUTE (listeners) di tipo MiddleWare
//**************************************************************************
//1.log della richiesta
app.use("/", function (req, res, next) {
  //originalUrl è la risorsa richiesta dal Client
  console.log("------->" + req.method + ":" + req.originalUrl);
  next();
});

//2. static route
// ./static è dove ci sono i file  statici, il metodo static va a cercare dentro a ./static se c'è la spedisce al client, se non la trova fa automaticamente next()
app.use("/", express.static("./static"));

//3. route lettura parametri post
//body parser serve ad andare a leggere i parametri post passati nel body
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));

//4.log dei parametri
app.use("/", function (req, res, next) {
  if (Object.keys(req.query).length > 0) {
    console.log("            Parametri GET:", req.query);
  }
  if (Object.keys(req.body).length > 0) {
    console.log("            Parametri BODY:", req.body);
  }
  next();
});

//**************************************************************************
// ELENCO DELLE ROUTE di risposta al Client
//**************************************************************************
//qua non serve next perchè quando finiscono partono subito
app.use("/", function (req, res, next) {
  mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (err) {
      res.status(503).send("DB CONNECTION ERROR");
    } else {
      console.log("Connessione OK");
      req["client"] = client; //salvo client nella request
      next();
    }
  });
});
app.get("/api/risorsa1", function (req, res, next) {
  //esegue la serializzazione in automatico , non c'è bisogno di fare JSON.stringify()
  let rName = req.query.nome;
  if (rName) {
    let db = req["client"].db(DBNAME) as _mongodb.Db; //tipizza per avere l'IntelliSense
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.find({ name: rName }).toArray();
    rq.then(function (data) {
      if (data) res.send(data);
      console.log("risorsa 1 : ", data);
    });
    rq.catch(function (err) {
      res
        .status(503)
        .send("Internal Server Error - Errore nella sintassi della Query");
    });
    rq.finally(function () {
      req["client"].close();
    });
  } else {
    res.status(400).send("Parametro richiesto non trovato");
    req["client"].close();
  }
});

app.patch("/api/risorsa2", function (req, res, next) {
  //esegue la serializzazione in automatico , non c'è bisogno di fare JSON.stringify()
  let rName = req.body.nome;
  let rVampires = req.body.vampires;
  if (rName && rVampires) {
    let db = req["client"].db(DBNAME) as _mongodb.Db; //tipizza per avere l'IntelliSense
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.updateOne(
      { name: rName },
      { $inc: { vampires: rVampires } }
    );
    rq.then(function (data) {
      if (data) res.send(data);
      console.log("risorsa 2 : ", data);
    });
    rq.catch(function (err) {
      res
        .status(503)
        .send("Internal Server Error - Errore nella sintassi della Query");
    });
    rq.finally(function () {
      req["client"].close();
    });
  } else {
    res.status(400).send("Parametri richiesti non trovati");
    req["client"].close();
  }
});

app.get("/api/risorsa3/:gender/:hair", function (req, res, next) {
  //esegue la serializzazione in automatico , non c'è bisogno di fare JSON.stringify()
  let rGender = req.params.gender;
  let rHair = req.params.hair;
  if (rGender && rHair) {
    //la if sull'esistenza dei parametri in quest ocaso non serve perchè non entra proprio nella route
    let db = req["client"].db(DBNAME) as _mongodb.Db; //tipizza per avere l'IntelliSense
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.find({$and:[{"gender":rGender},{"hair":rHair}]}).toArray();
    rq.then(function (data) {
      if (data) res.send(data);
      console.log("risorsa 3 : ", data);
    });
    rq.catch(function (err) {
      res
        .status(503)
        .send("Internal Server Error - Errore nella sintassi della Query");
    });
    rq.finally(function () {
      req["client"].close();
    });
  } else {
    res.status(400).send("Parametri richiesti non trovati");
    req["client"].close();
  }
});

//**************************************************************************
// DEFAULT ROUTE E ROUTE DI GESTIONE DEGLI ERRORI - default route : risponde sempre quando TUTTE  le altre route non sono andate a buon fine
//**************************************************************************
app.use("/", function (req, res, next) {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) {
    res.send("Servizio non trovato ");
  } else {
    res.send(paginaErrore);
  }
});
