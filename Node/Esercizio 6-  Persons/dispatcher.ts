//importo librerie 
import * as _http from 'http';
import * as _url from 'url';
import * as _fs from 'fs';
import * as _mime from 'mime';
import * as _queryString from 'query-string';
import {HEADERS} from './headers'; 

//tipizzo la variabile
let paginaErrore: string;

//creo classe dispatcher tramite ES6
export class Dispatcher {
    prompt: string = ">>>"
    //ogni listener è costituito da un JSON del tipo 
    //{"risorsa":"callback"}
    //i listener sono suddivisi in base al tipo di chiamata
    listeners: any = {
        "GET": {},
        "POST": {},
        "DELETE": {},
        "PUT": {},
        "PATCH": {}
    }
    constructor() { //viene richiamato una volta sola quando istanzio la classe
        init();
    }

    addListener(metodo: string, risorsa: string, callback: any) {
        metodo = metodo.toUpperCase();
        //if(this.listeners[metodo]){} <- qua controlla se esiste , sotto controlla se il metodo è in listeners 
        if (metodo in this.listeners) {
            //creo una nuova chiave risorsa che ha come valore callback
            this.listeners[metodo][risorsa] = callback;
        }
        else {
            //Lancio l'errore
            throw new Error("METODO NON VALIDO");
        }
    }
    innerDispatch(req: any, res: any) {
        //LETTURA DI METODO RISORSA E PARAMETRI 
        let metodo = req.method;
        let url = _url.parse(req.url, true);
        let risorsa = url.pathname;
        let parametri = url.query;

        req["GET"] = parametri; //Crea un JSON e ci mette dentro i parametri 

        //console log per controllare cosa ci è stato richiesto
        console.log(`${this.prompt} ${metodo} : ${risorsa} ${JSON.stringify(parametri)}`);
        if(req["BODY"])
        {
            console.log(`      ${JSON.stringify(req["BODY"])}`);
        }
        //controllo se è una pagina o un servizio 
        if (risorsa.startsWith("/api/")) {
            if (risorsa in this.listeners[metodo]) { //metodo contiene i listeners bisogna specificare perchè risorsa non contiene solo il metodo
                let callback = this.listeners[metodo][risorsa] //va nel listner dei metodi e va a prendere il listener in merito alla risorsa
                callback(req, res);//lancio in esecuzione la callback
            }
            else {
                //il client si aspetta un JSON 
                //in caso di errore a posto del JSON possiamo mandare una stringa 
                res.writeHead(404, HEADERS.text);
                res.write("Servizio non trovato")
                res.end();
            }
        }
        else {
            staticListener(req, res, risorsa);
        }
    }
    dispatch(req, res) {
        let metodo = req.method.toUpperCase();
        if (metodo == "GET") {
            this.innerDispatch(req, res);
        }
        else {
            let parametriBody: string = "";
            req.on("data", function (data) {
                parametriBody += data;
            })
            let parametriJson = {}
            let _this=this;
            req.on("end", function () {
                try {
                    //se i parametri sono in formato JSON il try va a buon fine 
                    parametriJson = JSON.parse(parametriBody);
                }
                catch (error) {
                    parametriJson = _queryString.parse(parametriBody);
                }
                finally {
                    req["BODY"] = parametriJson;
                    //puntatore alla classe 
                    _this.innerDispatch(req, res);
                }
            })
        }


    }
}

function init() {
    _fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
            paginaErrore = data.toString();//paginaErrore è una stringa, data è un oggetto si risolve con -toString
        }
        else {
            paginaErrore = "<h1> PAGINA NON TROVATA </h1>";
        }
    })
}

function staticListener(req: any, res: any, risorsa: any) {
    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    let filename = "./static" + risorsa;
    _fs.readFile(filename, function (err, data) {
        if (!err) {
            let header = { "Content-Type": _mime.getType(filename) };
            res.writeHead(200, header);
            res.write(data);
            res.end();
        }
        else {
            console.log(`${err.code} : ${err.message}`);
            //il client si aspetta una pagina quindi gli si manda paginaErrore
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }

    })
  
}