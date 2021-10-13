//importo librerie 
import * as _http from 'http';
import {HEADERS} from './headers'; //import ES6 
import {Dispatcher} from './dispatcher';

let PORT: number = 1337;

//dichiaro il dispatcher
let dispatcher:Dispatcher=new Dispatcher() //è tipizzato a dispatcher

//creo il server
let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req,res);
});

//metto il server in ascolto sulla porta 1337
server.listen(PORT, function () {

});

console.log("Server in ascolto sulla porta: " + PORT);

//registrazione dei servizi
dispatcher.addListener("POST", "/api/servizio1", function (req, res) {
    res.writeHead(200, HEADERS.json);
    let nome=req["BODY"].nome
    res.write(JSON.stringify({"ris":nome,"id":req["GET"].id}));
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 
})

dispatcher.addListener("GET", "/api/servizio2", function (req, res) {
    res.writeHead(200, HEADERS.json);
    let nome=req["GET"].nome;
    res.write(JSON.stringify({"ris":nome}));
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 
})