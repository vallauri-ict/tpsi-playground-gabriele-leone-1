"use strict"

//import dei packages su TypeScript
import * as _http from 'http';
import * as _url from 'url';
import * as _fs from 'fs';
import * as _mime from 'mime';
const HEADERS = require("./headers.json");

const PORT:number = 1337;
let paginaErrore:string; //variabili tipizzate

var server = _http.createServer(function (req, res) {

    //LETTURA DI METODO RISORSA E PARAMETRI 
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;

    if(risorsa=="/")
    {
        risorsa="/index.html";
    }
    if (!risorsa.startsWith("/api/")) {
        risorsa="./static"+risorsa;
        //la risorsa da leggere (1p), funzione di callback {asincrono} a cui vengono iniettati due parametri error e data. error è un oggetto ches e va tutto bene va in null sennò contiene il codice di errore
        _fs.readFile(risorsa,function(error,data){
            if (!error) {
                let header={"Content-Type": _mime.getType(risorsa)}; //vai a leggere il tipo di risorsa -- lookup se non funge
                res.writeHead(200,header);
                res.write(data)
                res.end();
                console.log("Richiesta Ricevuta: "+ risposta);
            }
            else
            {
                res.writeHead(404,HEADERS.html);
                res.write(paginaErrore);
                res.end();
            }
        }); 
    }

    
});
server.listen(PORT,function(){
    _fs.readFile("./static/error.html",function(errore,data){
        if(!errore)
        {
            paginaErrore=data.toString(); //poichè adesso accetta solo più stringhe 
        }
        else
        {
            paginaErrore="<h1>PAGINA NON TROVATA</h1>";
        }
    })
});
console.log("Server In Esecuzione sulla porta : " + PORT);
