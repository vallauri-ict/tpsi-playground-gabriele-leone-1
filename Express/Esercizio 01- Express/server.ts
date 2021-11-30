import * as _http from "http";
import  express from "express";
import HEADERS from "./headers.json";
let port:number = 1337;

let app=express();

let server = _http.createServer(app);

server.listen(port,function(){
    console.log("Server in ascolto sulla porta "+ port);
});

// ELENCO DELLE ROUTE (listeners)

app.use("*",function(req,res,next){
    //originalUrl è la risorsa richiesta dal Client
    console.log("------->"+req.method+":"+req.originalUrl)
    next()
})

app.get("*",function(req,res,next){
    //esegue la serializzazione in automatico , non c'è bisogno di fare JSON.stringify()
    res.send("this is the Response")
})
