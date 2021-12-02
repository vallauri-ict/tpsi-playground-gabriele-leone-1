import * as _http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
const port: number = 1337;

const dispatcher: Dispatcher = new Dispatcher();
const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5b";
// tutte le volte che arriva una richgiesta dal client parte questa funzione
const server = _http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
});

server.listen(port);
console.log("Server in ascolto sulla porta " + port);

//Visualizzare i facts che appartengono alla categoria music oppure che presentano uno score maggiore di
//620. Visualizzare _id, categories e score
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("facts");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.aggregate([
      {$match:
        { $or: [ {"categories":{$in:["music"]}},{"score":{"$gte":620}} ] }
      },
      {
        $project:{
          "_id":1,
          "categories":1,
          "score":1
        }
      }
    ]).toArray();
    rq.then(function (data) {
      console.log("Query 2 con promise: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("facts");
    const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
"Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
"m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]
    let rndId = "";
    for (var i = 0; i < 22; i++) {
      rndId += base64Chars[Math.floor(Math.random() * base64Chars.length - 1)];
    }
    let rq = collection.insertOne({"_id":new _mongodb.ObjectId(rndId),"dateCreation":new Date(),"dataUpdate":new Date(),"value":"Im inserting a new chuck norriss fact","icon_url":"https://assets.chucknorris.host/img/avatar/chuck-norris.png","url":"https://api.chucknorris.io/jokes/qpz0nosttf2slw7l-nonaw","score":0});
    rq.then(function (data) {
      console.log("Query 3 con promise: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("facts");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let data = new Date()
    let rq = collection.deleteMany({created_at:{$gte:{data}}});
    rq.then(function (data) {
      console.log("Query 2 con promise: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("facts");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.aggregate([{
      $unwind:"$categories"
    },
    {$group:{
      "_id":"$categories",
      "mediaScore":{$avg:"$categories"}
    }},
    {
      $sort:{
        mediaScore:-1,
        _id:-1
      }
    },
    {
      $project:{
        _id:1,
        mediaScore: { $round: [ "$mediaScore", 2 ] }
      }
    }
  ]).toArray();
    rq.then(function (data) {
      console.log("Query 2 con promise: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});


mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("facts");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.aggregate([
      {
        $group:{
          "_id":null,
          "categories":{ $addToSet: "$categories" }

        }
      },
    {
        $unwind: "$categories"
    },
    {
        $project: {
            _id: 0
        }
    },
]).toArray();
    rq.then(function (data) {
      console.log("Query 2 con promise: ", data);
    });
    rq.catch(function (err) {
      console.log("Errore esecuzione query: " + err.message);
    });
    rq.finally(function () {
      client.close();
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});
