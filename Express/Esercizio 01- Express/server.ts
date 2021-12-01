import * as http from "http";
import express from "express";
import HEADERS from "./headers.json";
import * as bodyParser from "body-parser";
import * as fs from "fs";
let port: number = 1337;

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
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));

//4.log dei parametri
app.use("/", function (req, res, next) {
  if ((Object.keys(req.query).length>0)){
    console.log("parametri GET:", req.query);
  }
  if (Object.keys(req.body).length>0) {
    console.log("parametri BODY:", req.body);
  }
  next();
});

//**************************************************************************
// ELENCO DELLE ROUTE di risposta al Client
//**************************************************************************
//qua non serve next perchè quando finiscono partono subito 
app.get("/api/risorsa1", function (req, res, next) {
  //esegue la serializzazione in automatico , non c'è bisogno di fare JSON.stringify()
  let nome=req.query.nome 
  res.send({"nome":nome});
});

app.post("/api/risorsa1", function (req, res, next) {
  //esegue la serializzazione in automatico , non c'è bisogno di fare JSON.stringify()
  let nome=req.body.nome
  res.send({"nome":nome})
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
