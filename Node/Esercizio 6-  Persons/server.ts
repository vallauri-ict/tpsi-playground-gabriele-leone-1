//importo librerie 
import * as _http from 'http';
import { json } from 'stream/consumers';
import { resourceLimits } from 'worker_threads';
let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");
let persons=require("./persons.json");

let PORT: number = 1337;

//creo il server
let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req,res);
});

//metto il server in ascolto sulla porta 1337
server.listen(PORT, function () {

});

console.log("Server in ascolto sulla porta: " + PORT);
//-------------------------
//Registrazione dei servizi
//-------------------------

dispatcher.addListener("GET", "/api/nazioni", function (req, res) {
    res.writeHead(200, HEADERS.json);
    let nazioni=[]//creo un vettore enumerativo 
    for (const person of persons["results"]) {
        if(!nazioni.includes(person.location.country)){
            nazioni.push(person.location.country)
        }
    }
    nazioni.sort() //ordinare alfabeticamente un vettore 
    res.write(JSON.stringify({"nazioni":nazioni})); //rendo il vettore enumerativo un JSON
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 
})