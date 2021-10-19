//importo librerie 
import * as _http from 'http';
import* as _fs from 'fs';
import HEADERS from './headers.json'; 
import {Dispatcher} from "./dispatcher";
import notizie from './notizie.json';


let PORT: number = 1337;
let paginaErrore;
let dispatcher:Dispatcher=new Dispatcher();
//creo il server
let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

//metto il server in ascolto sulla porta 1337
server.listen(PORT,function(){
    _fs.readFile("./static/error.html",function(errore,data){
        if(!errore)
        {
            paginaErrore=data;
        }
        else
        {
            paginaErrore="<h1> PAGINA NON TROVATA </h1>";
        }
    })
});

console.log("Server in ascolto sulla porta: " + PORT);
//-------------------------
//Registrazione dei servizi
//-------------------------
dispatcher.addListener("GET","/api/elenco",function(req,res){
    let elenco =[];
    for (const notizia of notizie) {
        let json = {
            "titolo": notizia.titolo,
            "visualizzazioni": notizia.visualizzazioni,
            "file": notizia.file,
        }
        elenco.push(json)
    }
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify(elenco)); //rendo il vettore enumerativo un JSON
    res.end();
})

dispatcher.addListener("POST","/api/dettagli",function(req,res){
    let fileReq=req["BODY"].file
    let idReq=req["BODY"].visual
    let risFile="./news/"+fileReq
    let pathNotizie='./notizie.json'
    // for (const object of notizie) {
    //     if (object.titolo==fileReq) {
    //         _fs.writeFile(pathNotizie,JSON.stringify(notizie),function(err){

    //         })
    //     }
    // }
    _fs.readFile(risFile,"utf-8",function(error,data){
        if(!error){
            res.writeHead(200, HEADERS.json);
            res.write(JSON.stringify(data.toString())); 
            res.end();
        }
        else
        {
            res.writeHead(404,HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    }
    )
})