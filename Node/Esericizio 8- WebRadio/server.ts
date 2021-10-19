//importo librerie 
import * as _http from 'http';
import * as _fs from 'fs';
import HEADERS from './headers.json';
import { Dispatcher } from "./dispatcher";
import { Utility } from "./utility"
import states from "./states.json"
import radios from "./radios.json"

let PORT: number = 1337;
let dispatcher: Dispatcher = new Dispatcher();

let utility = new Utility()
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
console.log(utility.stationCount())

dispatcher.addListener("GET", "/api/elenco", function (req, res) {
    let elenco = []
    for (const list of states) {
        let json = {
            "name": list.value,
            "station": list.stationcount
        }
        elenco.push(json)
    }
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({ "elenco": elenco })); //rendo il vettore enumerativo un JSON
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 
})

dispatcher.addListener("POST", "/api/radios", function (req, res) {
    let reqRadios = req["BODY"].name
    let radiovet = []
    for (const radio of radios) {
        if (radio.state == reqRadios) {
            let json = {
                "favicon": radio.favicon,
                "name": radio.name,
                "codec": radio.codec,
                "bitrate": radio.bitrate,
                "votes": radio.votes,
                "id": radio.id
            }
            radiovet.push(json)
        }

    }
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({ "radio": radiovet })); //rendo il vettore enumerativo un JSON
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 



})

dispatcher.addListener("POST", "/api/like", function (req, res) {
    let reqId = req["BODY"].id;
    let like;

    for (const radio of radios) {
        if (radio.id == reqId) {
            like = parseInt(radio.votes);
            like++;
            radio.votes = like.toString();
        }
    }

    _fs.writeFile("./radios.json", JSON.stringify(radios), function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("file salvato");
        }
    })

    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({ "nLike": like }));
    res.end();
})
