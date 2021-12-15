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

//middleware di apertura della connessione
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

//lettura delle collezioni presenti nel DB
app.get("/api/getCollections",function (req, res, next) {
  let db = req["client"].db(DBNAME) as _mongodb.Db;
  let collections = db.listCollections();
  let rq = collections.toArray();
  rq.then(function(data) {
    res.send(data)
  });
  rq.catch(function(err) {
    res.status(503).send("Query syntax error")
  });
  rq.finally(function() {
    req["client"].close()
  });
});

//middleWare per Intercettare parametri
let currentCollection=""
let id=""
app.use("/api/:collection/:id?",function(req,res,next){
  currentCollection=req.params.collection
  id=req.params.id
  next()
})
//con il ? risolvo i problemi rendendo facoltativo l'id che se non c'è viene messo a null
// app.use("/api/:collection/:id",function(req,res,next){
//   id=req.params.id
//   next()
// })

//listener specifico

//1- Listener GET - risponde  a tutte le chiamate GET , il client può fare due tipi di chiamate get , 
// /unicorns tutto l'elenco dei dati, /unicorns/5 dati specifici unicorno numero 5 
app.get("/api/*",function(req,res,next){
  let db = req["client"].db(DBNAME) as _mongodb.Db;
  let collections = db.collection(currentCollection);
  if(!id){
    let rq = collections.find().toArray();
    rq.then(function(data) {
      res.send(data)
    });
    rq.catch(function(err) {
      res.status(503).send("Query syntax error")
    });
    rq.finally(function() {
      req["client"].close()
    });
  }
  else
  {
    let oid=new _mongodb.ObjectId(id)
    let rq = collections.find({"_id":oid}).toArray();
    rq.then(function(data) {
      res.send(data)
    });
    rq.catch(function(err) {
      res.status(503).send("Query syntax error")
    });
    rq.finally(function() {
      req["client"].close()
    });
  }
  
})

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

app.use(function(err,req,res,next){
  console.log("Errore nel codice server",err.message)
})
