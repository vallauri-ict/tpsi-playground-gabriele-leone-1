//importo librerie 
import * as _http from 'http';
import * as _url from 'url';
import * as _fs from 'fs';
import * as _mime from 'mime';
let HEADERS= require("headers.json");

//tipizzo la variabile
let paginaErrore : string;

//creo classe dispatcher tramite ES6
class Dispatcher{
    prompt:string=">>>"
    //ogni listener è costituito da un JSON del tipo 
    //{"risorsa":"callback"}
    //i listener sono suddivisi in base al tipo di chiamata
    listeners:any={
        "GET":{},
        "POST":{},
        "DELETE":{},
        "PUT":{},
        "PATCH":{}
    }
    constructor(){
      
    }
    addListener(metodo:string,risorsa:string,callback:any){
        metodo=metodo.toUpperCase();
        //if(this.listeners[metodo]){} <- qua controlla se esiste , sotto controlla se il metodo è in listeners 
        if(metodo in this.listeners){
            //creo una nuova chiave risorsa che ha come valore callback
            this.listeners[metodo][risorsa]=callback;
        }
        else
        {
            //Lancio l'errore
            throw new Error("METODO NON VALIDO");
        }
    }
}