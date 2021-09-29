//importo librerie 
import * as _http from 'http';
let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");

let PORT: number = 1337;

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
    res.write(JSON.stringify({"ris":"ok"}));
    res.end(); //se c'è solo un write si può mettere il contenuto di write dentro end 
})