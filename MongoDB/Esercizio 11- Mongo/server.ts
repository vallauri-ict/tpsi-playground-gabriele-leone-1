import * as _http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
const port: number = 1337;
const mongoClient = _mongodb.MongoClient;
const dispatcher: Dispatcher = new Dispatcher();

const CONNECTIONSTRING = "mongodb://127.0.0.1:27017"

// tutte le volte che arriva una richgiesta dal client parte questa funzione
const server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

server.listen(port);
console.log("Server in ascolto sulla porta " + port);


//inserimento di un nuovo record
// mongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
//     if (!err) {
//         let db = client.db("5b_studenti");
//         let collection = db.collection("studenti");
//         let student = { "nome": "Aurora", "cognome": "Montalcini", "studente": true, "residenza": { "citta": "Genola", "provincia": "cuneo", "cap": "12045" }, "eta": 16, "hobbies": ["nuoto", "tennis"] }
//         collection.insertOne(student, function (err, data) {
//             if (!err) {
//                 console.log(data);
                
//             } else {
//                 console.log("errore esecuzione query: " + err.message);
//                 ; //chiudo la connessione
//             }
//             client.close()
//         })
//     }
//     else {
//         console.log("errore nella connessione al databasse :" + err.message)
//     }
// });

//Modello di accesso al database MongoDB
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db("5b_studenti");
        let collection = db.collection("studenti");
        //prende tutti i record e li converte in un vettore enumerativo
        collection.find().toArray(function (err, data) {
            if (!err) {
                console.log(data);
                client.close(); //chiudo la connessione
            } else {
                console.log("errore esecuzione query: " + err.message);
                client.close(); //chiudo la connessione
            }
        });
    }
    else {
        console.log("errore nella connessione al databasse :" + err.message)
    }
});
// update
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db("5B_Studenti")
        let collection = db.collection("Studenti")
        collection.updateOne({"Nome":"Mario"}, {$set:{"Residenza":"Fossano"}}, function (err, data) {
            if (!err) {
                console.log("FIND",data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        }) // updateOne(filtro, azione)
            
    } else {
        console.log("Errore connessione al db")
    }
})

// deleteMany
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db("5B_Studenti")
        let collection = db.collection("Studenti")
        collection.deleteMany({"Residenza":"Fossano"}, function (err, data) {
            if (!err) {
                console.log("DELETE",data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        }) // updateOne(filtro, azione)
            
    } else {
        console.log("Errore connessione al db")
    }
})