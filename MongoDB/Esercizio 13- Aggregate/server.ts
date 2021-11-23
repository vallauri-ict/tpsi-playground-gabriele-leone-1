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

//usiamo promise

//QUERY 1- Si vogliono selezionare i record che hanno status A, raggrupparli secondo il campo cust_id e,
//per ogni gruppo, eseguire la somma del campo amount (importo unitario)
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    //aggregate si aspetta un vettore enumerativo
    //nel match posso utilizzare i filtri di find
    //_id è una parola fissa che indica il campo su cui vogliamo fare i gruppi
    //nell'id devo mettere il $ davanti al nome del campo
    //per ogni gruppo devo creare un campo che in questo caso è "totale"
    //nel "totale" dobbiamo mettere il nome del campo di cui vogliamo eseguire l'operazione e deve essere sempre preceduto dal dollaro
    //a sinistra dei due punti no dollaro, a destra si
    //dopo $group il record set risultante avrà solo due colonne che sono quelle selezionate nel group
    let rq = collection
      .aggregate([
        { $match: { status: "A" } },
        { $group: { _id: "$cust_id", totale: { $sum: "$amount" } } },
        { $sort: { totale: -1 } },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 1: ", data);
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

//QUERY 2- Utilizzo della funzione di aggregazione $avg sull ex prec
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    let rq = collection
      .aggregate([
        {
          $group: {
            _id: "$cust_id",
            avgAmount: { $avg: "$amount" },
            avgTotal: { $avg: { $multiply: ["$qta", "$amount"] } },
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 2: ", data);
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

//QUERY 3- Conteggio degli unicorni maschi e degli unicorni femmina
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $match: { gender: { $exists: true } } },
        { $group: { _id: "$gender", totale: { $sum: 1 } } },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 3: ", data);
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

//QUERY 4-Calcolare il numero medio di vampiri uccisi dagli unicorni femmina e dagli unicorni maschi
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $match: { gender: { $exists: true } } },
        {
          $group: {
            _id: { gender: "$gender" },
            mediaVampiri: { $avg: "$vampires" },
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 4: ", data);
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

//QUERY 5- : raggruppare gli unicorni per genere e tipo di pelo
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $match: { gender: { $exists: true } } },
        {
          $group: {
            _id: { gender: "$gender", hair: "$hair" },
            nEsemplari: { $sum: 1 },
          },
        },
        { $sort: { nEsemplari: -1, _id: -1 } },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 5: ", data);
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

//QUERY 6- numero medio di vampiri uccisi dagli unicorni complessivamente presenti nella collezione
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $match: { gender: { $exists: true } } },
        {
          $group: {
            _id: {},
            media: { $avg: "$vampires" },
          },
        },
        //arrotonda alla cifra intera
        //per arrotondare a quante cifre  vogliamo noi dopo la virgola bisogna scrivere media:{"$round":[$media,n]}
        { $project: { _id: 0, ris: { $round: "$media" } } },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 6: ", data);
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

//QUERY 7-Media voti laboratorio,Quiz e Esami
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("quizzes");
    let rq = collection
      .aggregate([
        //le funzioni di aggregazione usate dentro project lavorano sul campo del singolo record
        {
          $project: {
            quizAvg: { $avg: "$quizzes" },
            labAvg: { $avg: "$labs" },
            examAvg: { $avg: ["$midterm", "$final"] },
          },
        },
        {
          $project: {
            quizAvg: { $round: ["$quizAvg", 1] },
            labAvg: { $round: ["$labAvg", 1] },
            examAvg: { $round: ["$examAvg", 1] },
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 7: ", data);
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

//QUERY 7 bis- Media delle medie
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("quizzes");
    let rq = collection
      .aggregate([
        //le funzioni di aggregazione usate dentro project lavorano sul campo del singolo record
        {
          $project: {
            quizAvg: { $avg: "$quizzes" },
            labAvg: { $avg: "$labs" },
            examAvg: { $avg: ["$midterm", "$final"] },
          },
        },
        {
          $project: {
            quizAvg: { $round: ["$quizAvg", 1] },
            labAvg: { $round: ["$labAvg", 1] },
            examAvg: { $round: ["$examAvg", 1] },
          },
        },
        {
          $group: {
            _id: {},
            mediaQuiz: { $avg: "$quizAvg" },
            mediaLab: { $avg: "$labAvg" },
            mediaExam: { $avg: "$examAvg" },
          },
        },
        {
          $project: {
            _id: 0,
            mediaQuiz: { $round: ["$mediaQuiz", 2] },
            mediaLab: { $round: ["$mediaLab", 2] },
            mediaExam: { $round: ["$mediaExam", 2] },
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 7 bis: ", data);
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

//QUERY 8- Supponendo di avere una collezione di studenti dove, per ogni studente è riportato un array
//enumerativo con l‟elenco dei suoi voti, individuare nome e codice del secondo studente femmina
//con la media più alta.
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("students");
    let regex = new RegExp("F", "i");
    let rq = collection
      .aggregate([
        {
          //per rendere case-insensitive si può anche fare genere: { $regex: /F/i }
          $match: { genere: { $regex: regex } },
        },
        {
          $project: {
            genere: 1,
            nome: 1,
            classe: 1,
            mediaVoti: { $avg: "$voti" },
          },
        },
        { $sort: { mediaVoti: -1 } },
        //tolgo il primo
        { $skip: 1 },
        //prendo uno
        { $limit: 1 },
        //oppure {$limit:2} ne prendo due e poi {$skip:1} ne salto uno e prendo il secondo
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 8: ", data);
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

//QUERY 9- Utilizzo unwind
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    let rq = collection
      .aggregate([
        { $project: { status: 1, nDettagli: 1 } },
        { $unwind: "$nDettagli" },
        { $group: { _id: "$status", sommaDettagli: { $sum: "$nDettagli" } } },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 9: ", data);
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

//QUERY 10-Prendere quelli che sono nati dal 2000 in poi
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("students");
    let rq = collection
      .find({ $expr: { $gte: [{ $year: "$nato" }, 2000] } })
      .project({ _id: 0, nome: 1, genere: 1, classe: 1, nato: 1 })
      .toArray();
    rq.then(function (data) {
      console.log("Query 10: ", data);
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

//Query 11-Trovare il peso medio degli unicorni femmina ed il peso medio degli unicorni maschi
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        {
          $group: {
            _id: "$gender",
            avgPeso: { $avg: "$weight" },
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 11: ", data);
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

//Query 12-Considerando soltanto gli unicorni che amano le mele, trovare il numero di vampiri complessivamente uccisi
//dagli unicorni maschi ed il numero di vampiri complessivamente uccisi dagli unicorni femmina
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $match: { loves: { $in: ["apple"] } } },
        {
          $group: {
            _id: "$gender",
            vampiresTotal: { $sum: "$vampires" },
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 12: ", data);
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

//Query 13-Visualizzare i nomi dei frutti più amati dagli unicorni, in ordine di preferenza.
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let rq = collection
      .aggregate([
        { $unwind: "$loves" },
        {
          $group: {
            _id: "$loves",
            fruitCount: { $sum: 1 },
          },
        },
        {
          $sort: {
            fruitCount: -1,
          },
        },
        { $limit: 3 },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 13: ", data);
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

//Query 14-Visualizzare i nomi dei frutti più amati dagli unicorni, in ordine di preferenza.
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("students");
    let rq = collection
      .aggregate([
        {
          $project: {
            _id: 0,
            avgVoti: { $avg: "$voti" },
            classe: 1,
          },
        },
        {
          $group: {
            _id: "$classe",
            avgMedia: { $avg: "$avgVoti" },
          },
        },
        {
          $project: {
            _id: 0,
            classe: "$_id",
            avgMedia: 1,
          },
        },
        {
          $match: {
            avgMedia: { $gte: 6 },
          },
        },
        {
          $project: {
            avgMedia: 1,
          },
        },
      ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 14: ", data);
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

//Query 15- Elenco degli studenti non ancora maggiorenni
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("students");
    let rq = collection
    .aggregate([
      {$project: {
        nome: 1,
        nato: 1,
        eta: { $dateDiff: {
          startDate: "$nato",
          endDate: "$$NOW",
          unit: "year",
        },
    }}},
    {$match: {eta: {$lte: 18}}}
   ]).toArray();
    rq.then(function (data) {
      console.log("Query 15: ", data);
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

//Query 16- Elenco degli studenti nati in un certo anno inserito da tastiera
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let date=2000
    let collection = db.collection("students");
    let rq = collection.aggregate([
      { $match : { "$expr" : { "$eq" : [ { "$year" : "$nato" } , date ] } } },
      { $project : { "nome" : 1, "genere" : 1, "classe" : 1, "nato" : 1 } }
      //oppure più completa let date = new Date("1998-12-31").getFullYear();
  ])
      .toArray();
    rq.then(function (data) {
      console.log("Query 16: ", data);
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
