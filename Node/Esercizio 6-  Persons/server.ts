//importo librerie 
import * as _http from 'http';
import { json } from 'stream/consumers';
import { resourceLimits } from 'worker_threads';
let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");
let persons = require("./persons.json");

let PORT: number = 1337;

//creo il server
let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

//metto il server in ascolto sulla porta 1337
server.listen(PORT, function () {

});

console.log("Server in ascolto sulla porta: " + PORT);
//-------------------------
//Registrazione dei servizi
//-------------------------

dispatcher.addListener("GET", "/api/nazioni", function (req, res) {
    let nazioni = []//creo un vettore enumerativo 
    for (const person of persons["results"]) {
        if (!nazioni.includes(person.location.country)) {
            nazioni.push(person.location.country)
        }
    }
    nazioni.sort() //ordinare alfabeticamente un vettore 
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({ "nazioni": nazioni })); //rendo il vettore enumerativo un JSON
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 
})

dispatcher.addListener("GET", "/api/persone", function (req, res) {
    let nazione: string = req["GET"].nazione
    let persone: object[] = []
    for (const person of persons.results) {
        if (person.location.country == nazione) {
            let json = {
                "name": person.name.title + " " + person.name.first + " " + person.name.last,
                "city": person.location.city,
                "state": person.location.state,
                "cell": person.cell
            }
            persone.push(json)
        }
    }
    res.writeHead(200, HEADERS.json)
    res.write(JSON.stringify(persone))
    res.end()
})
dispatcher.addListener("PATCH", "/api/dettagli", function (req, res) {
    let personReq = req["BODY"].person
    let trovato: boolean = false
    let person;
    for ( person of persons.results) {
        if ((person.name.title + " " + person.name.first + " " + person.name.last) == personReq) {
            trovato = true;
            break;
        }
    }
    if (trovato) {
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify(person))
        res.end();
    }
    else
    {
        res.writeHead(404, HEADERS.json);
        res.write("Persona non trovata")
        res.end();
    }
})

dispatcher.addListener("DELETE", "/api/elimina", function (req, res) {
    let personReq = req["BODY"].person
    let trovato: boolean = false
    let i;
    for ( i=0;i< persons.results.length;i++) {
        if ((persons.results[i].name.title + " " + persons.results[i].name.first + " " + persons.results[i].name.last) == personReq) {
            trovato = true;
            break;
        }
    }
    if (trovato) {
        persons.results.splice(i,1)
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify("Persona eliminata Correttamente")) //nel 200 ci vuole un JSON SERIALIZZATO
        res.end();
    }
    else
    {
        res.writeHead(404, HEADERS.text);
        res.write("Record Non trovato")
        res.end();
    }
})