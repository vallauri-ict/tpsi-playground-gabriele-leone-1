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

//Pagina appunti : 15

//QUERY 1 - Trovare gli unicorni che hanno un peso compreso tra 700 e 800
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({ weight: { $lte: 800, $gte: 700 } })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 1: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 2- Trovare gli unicorni di genere maschile che amano l’uva e che hanno ucciso più di 60 vampiri
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({
        $and: [{ gender: "m" }, { loves: "grape" }, { vampires: { $gte: 60 } }],
      })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 2: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 2 BIS- Prova $in
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({
        $and: [
          { gender: "m" },
          { loves: { $in: ["grape", "apple"] } },
          { vampires: { $gte: 60 } },
        ],
      })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 2 BIS: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 3- Trovare gli unicorni di genere femminile o che pesano meno di 700 kg
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({ $or: [{ gender: "f" }, { weigth: { $lte: 700 } }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 3: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 4- Trovare gli unicorni che amano (l’uva o le mele) e che hanno ucciso più di 60 vampiri
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({
        $and: [
          { loves: { $in: ["apple", "grape"] } },
          { vampires: { $gte: 60 } },
        ],
      })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 4: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 5- Trovare gli unicorni che amano (l’uva e le mele) e che hanno ucciso più di 60 vampiri
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({ loves: { $all: ["grape", "watermelon"] } })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 5: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 6-Trovare gli unicorni che hanno il pelo marrone oppure grigio
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({ $or: [{ hair: "brown" }, { hair: "grey" }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 6: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 6 BIS
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({ hair: { $in: ["grey", "brown"] } })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 6 BIS: ", "Record " + data.length, data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 7-Trovare gli unicorni vaccinati
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    collection
      .find({ $and: [{ vaccinated: { $exists: true } }, { vaccinated: true }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 7: ", "Record " + data.length, data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 9-Trovare gli unicorni di genere femminile il cui nome inizia con la lettera A (forma completa)
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    let regex = new RegExp("^A", "i"); //trova quelli che iniziano con a maiuscola e minuscola
    collection
      .find({ $and: [{ name: { $regex: regex } }, { gender: "f" }] })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 9: ", "Record " + data.length, data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 10-Trovare un unicorno sulla base dell’ID
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo 61823931b8b9dc10e4699abe
    collection
      .find({ _id: new _mongodb.ObjectId("61823931b8b9dc10e4699abe") })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 10: ", "Record " + data.length, data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 11a-Visualizzare nome e vampiri uccisi per tutti gli unicorni di genere maschile
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    collection
      .find({ gender: "m" })
      .project({ name: 1, vampires: 1, _id: 0 })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 11a: ", "Record " + data.length, data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 11b-Visualizzare i dati precedenti in modo ordinato sul n. decrescente di vampiri uccisi
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //vampires:-1 in decrescente a parità di vampires si ordina in base al nome (name:1)
    collection
      .find({ gender: "m" })
      .project({ name: 1, vampires: 1, _id: 0 })
      .sort({ vampires: -1, name: 1 })
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 11b: ", "Record " + data.length, data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 11c-Visualizzare i dati precedenti visualizzando soltanto i primi 3 record
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //vampires:-1 in decrescente a parità di vampires si ordina in base al nome (name:1)
    collection
      .find({ gender: "m" })
      .project({ name: 1, vampires: 1, _id: 0 })
      .sort({ vampires: -1, name: 1 })
      .limit(3)
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 11c: ", "Record " + data.length, data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 12-Contare il numero di vampiri che pesano più di 500 kg
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    collection.find({ weight: { $gt: 500 } }).count(function (err, data) {
      if (!err) {
        console.log("Query 12: ", data);
        client.close(); //chiudo la connessione
      } else {
        console.log("errore esecuzione query: " + err.message);
        client.close(); //chiudo la connessione
      }
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 13-Visualizzare peso e pelo dell’unicorno Aurora (findOne)
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //findOne non accetta .project() in coda
    collection.findOne(
      { name: "Aurora" },
      { projection: { weight: 1, hair: 1 } },
      function (err, data) {
        if (!err) {
          console.log("Query 13: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      }
    );
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 14-Visualizzare i frutti amati dagli unicorni di genere femminile (ogni frutto una sola volta)
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    collection.distinct("loves", { gender: "f" }, function (err, data) {
      if (!err) {
        console.log("Query 14: ", data);
        client.close(); //chiudo la connessione
      } else {
        console.log("errore esecuzione query: " + err.message);
        client.close(); //chiudo la connessione
      }
    });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 15-Inserire un nuovo unicorno e, al termine dell’inserimento, cancellarlo nella stessa query
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    collection.insertOne(
      { name: "Apollo", gender: "m", loves: ["apple", "energon"] },
      function (err, data) {
        if (!err) {
          console.log("Query 15 a : ", data);
          collection.deleteMany({ name: "Apollo" }, function (err, data) {
            if (!err) {
              console.log("Query 15 b:", data);
            } else {
              console.log("errore esecuzione query: " + err.message);
            }
            client.close(); //chiudo la connessione
          });
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      }
    );
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 16-Incrementare di 1 il numero dei vampiri uccisi da Pilot
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //se provo a incrementare un campo  che non esiste crea il campo
    collection.updateOne(
      { name: "Pilot" },
      { $inc: { vampires: 1 } },
      function (err, data) {
        if (!err) {
          console.log("Query 16: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      }
    );
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 16 Bis-Incrementare di 1 il numero dei vampiri uccisi da Pilot
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //se provo a incrementare un campo  che non esiste crea il campo
    //se provo a mettere un record che non esiste viene automaticamente creato tramite upsert
    collection.updateOne(
      { name: "Arishem" },
      { $inc: { vampiress: 1 } },
      { upsert: true },
      function (err, data) {
        if (!err) {
          console.log("Query 16 bis : ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      }
    );
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 17-Aggiungere che l’unicorno Aurora ama anche le carote ed il suo peso è aumentato di 10kg
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    collection.updateOne(
      { name: "Aurora" },
      { $addToSet: { loves: "carrot" }, $inc: { weight: 10 } },
      function (err, data) {
        if (!err) {
          console.log("Query 17: ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      }
    );
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 18-Incrementare di 1 il numero di vampiri uccisi dall’unicorno Pluto. Se il record non esiste crearlo
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //se provo a incrementare un campo  che non esiste crea il campo
    //se provo a mettere un record che non esiste viene automaticamente creato tramite upsert:true
    collection.updateOne(
      { name: "Pluto" },
      { $inc: { vampires: 1 } },
      { upsert: true },
      function (err, data) {
        if (!err) {
          console.log("Query 18 : ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      }
    );
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 19-Aggiungere il campo vaccinated=false a tutti gli unicorni che non dispongono del campo vaccinated
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    collection.updateMany(
      { vaccinated: { $exists: false } },
      { $set: { vaccinated: true } },
      function (err, data) {
        if (!err) {
          console.log("Query 19: ", data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db");
  }
});

//QUERY 20-Rimuovere gli unicorni che amano sia l’uva sia le carote
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //se provo a incrementare un campo  che non esiste crea il campo
    //elimina campi che hanno sia un valore sia l'altro
    collection.deleteMany(
      { loves: { $all: ["grape", "carrot"] } },
      function (err, data) {
        if (!err) {
          console.log("Query 20 : ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      }
    );
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 21-Trovare l’unicorno femmina che ha ucciso il maggior numero di vampiri.
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //projection per selezionare che valori voglio far vedere
    //posso invertire sia limit che sort poiché il find fa prima il sort poi skip e poi limit indipendemente da come li scrivo
    //posso anche utilizzare per la find: .project({"_id":0,"name":1, "vampires":1})
    collection
      .find({ gender: "f" }, { projection: { _id: 0, name: 1, vampires: 1 } })
      .sort({ vampires: -1 })
      .limit(1)
      .toArray(function (err, data) {
        if (!err) {
          console.log("Query 21 : ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      });
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 22-Sostituire completamente il record dell’unicorno Pluto con un nuovo record
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //se metto upsert true se non esiste lo crea è facoltativo
    //replaceOne cancella tutti i campi del record trovato anche se non inseriti !(TRANNE L'ID)
    //se voglio che il name rimanga lo stesso devo rimetterlo nel secondo parametro
    collection.replaceOne(
      { name: "Pluto" },
      { name: "Pluto", residenza: "Fossano", loves: ["grape", "energon"] },
      function (err, data) {
        if (!err) {
          console.log("Query 22 : ", data);
          client.close(); //chiudo la connessione
        } else {
          console.log("errore esecuzione query: " + err.message);
          client.close(); //chiudo la connessione
        }
      }
    );
  } else {
    console.log("errore nella connessione al databasse :" + err.message);
  }
});

//QUERY 1 bis - Trovare gli unicorni che hanno un peso compreso tra 700 e 800 USANDO LE PROMISE
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    //prende tutti i record e li converte in un vettore enumerativo
    //$lte: less than equal , $gte: greater than equal
    let rq = collection.find({ weight: { $lte: 800, $gte: 700 } }).toArray();
    rq.then(function (data) {
      console.log("Query 1 con promise: ", data);
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
