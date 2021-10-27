"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import { Dispatcher } from "./dispatcher"
let dispatcher = new Dispatcher()

import HEADERS from "./headers.json"
import facts from "./facts.json";

let PORT: number = 1337;
/* ********************** */

// const categories = []
const categories = ["career", "money", "explicit", "history", "celebrity", "dev", "fashion", "food", "movie", "music", "political", "religion", "science", "sport", "animal", "travel"]

const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io"
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]


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
dispatcher.addListener("GET", "/api/categories", function (req, res) {
    let categorie = []
    for (const categoria of facts["facts"]) {
        for (let i = 0; i < categoria.categories.length; i++) {
            if (!categorie.includes(categoria.categories[i])) {
                categorie.push(categoria.categories[i])
            }
        }
    }
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({ "categorie": categorie })); //rendo il vettore enumerativo un JSON
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 
})

dispatcher.addListener("GET", "/api/facts", function (req, res) {
    let reqFacts = req["GET"].name
    let elenco = []

    for (const categoria of facts["facts"]) {
        for (let i = 0; i < categoria.categories.length; i++) {
            if (categoria.categories[i] == reqFacts) {
                let json = {
                    "value": categoria.value,
                    "id": categoria.id
                }
                elenco.push(json)
            }
        }

    }
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({ "facts": elenco })); //rendo il vettore enumerativo un JSON
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 
})

dispatcher.addListener("POST", "/api/rate", function (req, res) {
    let reqId=req["BODY"].ids
    let i=0
    for (const id of reqId[i]) {
        _fs.readFile("./facts.json",function(error,data){
            if(error){
                console.error(error)
            }
            else
            {
                let ide=id[i]
                elabora(JSON.parse(data.toString()),ide)
                i++
            }
        })
    }
    function elabora(factor,ide){
        for (const item of factor["facts"]) {
            for (let i = 0; i < item.length; i++) {
                if(item.facts.id==ide){
                    item.facts.score=(parseInt(item.facts.score) + 1).toString();
                }
            }
            
        }
        _fs.writeFile("./facts.json",JSON.stringify(factor),function(err){
            if(err){
                console.error(err)
            }
            else{
                console.log("OK")
            }
        })
    }

})



